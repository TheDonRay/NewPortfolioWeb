import { useEffect, useRef } from "react";

/**
 * A field of dotted flow lines that bow around an elliptical lens, with a
 * few blue sparks riding them. The pointer parts the lines as it passes.
 * Plain 2D canvas: no WebGL, pauses offscreen, one still frame when the
 * visitor prefers reduced motion.
 */

const SIGNAL = [61, 123, 255];
// Dots are bucketed by brightness so each frame is a handful of fills
const BUCKETS = 6;

// Cheap stable hash -> [0, 1) so sparks stay on the same dots
const hash = (a, b) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export default function SignalField({ className, intensity = 1, lens = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let rows = 0;
    let step = 0;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();

    // Pointer, eased so the parting glides instead of snapping
    const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, power: 0, target: 0 };

    const resize = () => {
      const box = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, box.width);
      h = Math.max(1, box.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const narrow = w < 700;
      rows = Math.round(h / (narrow ? 15 : 13));
      step = narrow ? 7 : 8;
    };

    const buckets = Array.from({ length: BUCKETS }, () => []);
    const sparks = [];

    const frame = (now) => {
      const t = (now - t0) / 1000;

      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.power += (pointer.target - pointer.power) * 0.06;

      ctx.clearRect(0, 0, w, h);
      for (const b of buckets) b.length = 0;
      sparks.length = 0;

      const cx = w * 0.5;
      const cy = h * 0.52;
      // The lens: an ellipse the lines flow around; flatter on portrait
      // screens so it never swallows the first viewport
      const portrait = h > w;
      const rx = w * (portrait ? 0.56 : 0.4) * lens;
      const ry = h * (portrait ? 0.1 : 0.19) * lens;
      const half = h * 0.62;
      const reach = Math.min(w, h) * 0.22;

      for (let r = 0; r <= rows; r++) {
        const off = (r / rows) * 2 - 1; // -1 top … 1 bottom
        const side = off < 0 ? -1 : 1;
        const mag = Math.abs(off);
        const phase = r * 0.37;

        for (let x = -step; x <= w + step; x += step) {
          const dx = (x - cx) / rx;
          const lensH = dx * dx < 1 ? ry * Math.sqrt(1 - dx * dx) : 0;

          // squeeze the line into the band between the lens edge and the frame
          let y = cy + side * (lensH + mag * (half - lensH));

          // slow travelling swell, stronger toward the lens
          const near = 1 - Math.min(1, Math.abs(dx));
          y +=
            Math.sin(x * 0.006 + t * 0.55 + phase) * (3 + near * 7) +
            Math.sin(x * 0.0023 - t * 0.3 + r * 0.11) * 6;

          // the pointer pushes lines away vertically
          if (pointer.power > 0.01) {
            const px = x - pointer.x;
            const py = y - pointer.y;
            const d2 = px * px + py * py;
            const fall = Math.exp(-d2 / (2 * reach * reach));
            y += Math.sign(py || 1) * fall * reach * 0.55 * pointer.power;
          }

          if (y < -4 || y > h + 4) continue;

          // brightest where lines bunch at the lens rim, fading to the edges
          const rim = 1 - Math.min(1, mag * 1.15);
          const edge = Math.min(1, Math.min(x, w - x) / (w * 0.18));
          // and quieter in the bottom band, where the intro copy sits
          const low = Math.min(1, (h - y) / (h * 0.45) + 0.2);
          const a = (0.2 + rim * 0.75 * (0.45 + near * 0.55)) * edge * low * intensity;
          if (a < 0.03) continue;

          const k = hash(r, Math.round(x / step));
          if (k > 0.972) {
            sparks.push(x, y, 0.45 + 0.55 * Math.sin(t * 2.2 + k * 40) ** 2);
            continue;
          }
          const bi = Math.min(BUCKETS - 1, Math.floor(a * BUCKETS * 1.3));
          buckets[bi].push(x, y);
        }
      }

      for (let b = 0; b < BUCKETS; b++) {
        const list = buckets[b];
        if (!list.length) continue;
        ctx.fillStyle = `rgba(232, 236, 242, ${((b + 1) / BUCKETS) * 0.95})`;
        ctx.beginPath();
        for (let i = 0; i < list.length; i += 2) ctx.rect(list[i], list[i + 1], 1.4, 1.4);
        ctx.fill();
      }

      for (let i = 0; i < sparks.length; i += 3) {
        ctx.fillStyle = `rgba(${SIGNAL[0]}, ${SIGNAL[1]}, ${SIGNAL[2]}, ${sparks[i + 2] * intensity})`;
        ctx.fillRect(sparks[i] - 0.6, sparks[i + 1] - 2.2, 2.2, 5.4);
      }

      if (!still && visible) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (still || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    frame(performance.now());

    const ro = new ResizeObserver(() => {
      resize();
      if (still || !raf) frame(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    // Listen on the field's section so text on top doesn't block the effect
    const host = canvas.parentElement;
    const onMove = (e) => {
      const box = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - box.left;
      pointer.ty = e.clientY - box.top;
      if (pointer.target === 0) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
      pointer.target = 1;
    };
    const onLeave = () => {
      pointer.target = 0;
    };
    if (fine && !still && host) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
    }

    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host?.removeEventListener("pointermove", onMove);
      host?.removeEventListener("pointerleave", onLeave);
    };
  }, [intensity, lens]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
