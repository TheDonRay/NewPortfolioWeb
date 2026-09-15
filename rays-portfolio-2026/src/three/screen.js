import * as THREE from "three";

/**
 * The laptop display, drawn to a 2D canvas and uploaded as a texture.
 *
 * Runs a boot sequence (dead → power → RAYAT OS boot log) and then loops an
 * editor that types itself out character by character. `state.typing` is the
 * signal the hands animate against, so the fingers and the text stay in sync.
 */

const W = 1024;
const H = 640;
const MONO = '"JetBrains Mono", "Fira Code", ui-monospace, monospace';

/* Boot sequence timing, in seconds from scene start. */
const T_POWER = 0.55;
const T_BOOT = 1.25;
const T_EDITOR = 3.6;

const CHARS_PER_SEC = 27;
const HOLD_AFTER_TYPED = 3.2; // beat before the file retypes itself
const REDRAW_HZ = 24;

const BOOT_LOG = [
  "loading kernel modules",
  "mounting /dev/curiosity",
  "starting runtime services",
  "resolving coffee dependency",
  "system ready",
];

/* Each line is a list of [text, tone] segments. Tone drives colour only. */
const CODE_LINES = [
  [
    ["const ", "kw"],
    ["rayat", "id"],
    [" = {", "pn"],
  ],
  [
    ["  role", "key"],
    [": ", "pn"],
    ['"Software Engineer"', "str"],
    [",", "pn"],
  ],
  [
    ["  studying", "key"],
    [": ", "pn"],
    ['"CS + Math @ Hunter"', "str"],
    [",", "pn"],
  ],
  [
    ["  stack", "key"],
    [": ", "pn"],
    ["[", "pn"],
    ['"React"', "str"],
    [", ", "pn"],
    ['"Three.js"', "str"],
    [", ", "pn"],
    ['"Python"', "str"],
    ["],", "pn"],
  ],
  [
    ["  building", "key"],
    [": ", "pn"],
    ["true", "kw"],
    [",", "pn"],
  ],
  [["};", "pn"]],
  [],
  [["// building is the escape. ship daily.", "cm"]],
];

const TONE = {
  kw: "rgba(255,255,255,0.94)",
  id: "#ffffff",
  key: "rgba(255,255,255,0.60)",
  str: "rgba(196,216,255,0.86)",
  pn: "rgba(255,255,255,0.34)",
  cm: "rgba(255,255,255,0.24)",
};

const LINE_LENGTHS = CODE_LINES.map((line) =>
  line.reduce((m, [text]) => m + text.length, 0),
);
const TOTAL_CHARS = LINE_LENGTHS.reduce((a, b) => a + b, 0);

/** Where the caret sits after `revealed` characters. */
function caretAt(revealed) {
  let rem = revealed;
  for (let i = 0; i < LINE_LENGTHS.length; i++) {
    if (rem <= LINE_LENGTHS[i]) return { line: i, col: rem };
    rem -= LINE_LENGTHS[i];
  }
  const last = LINE_LENGTHS.length - 1;
  return { line: last, col: LINE_LENGTHS[last] };
}

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}
const TYPE_DURATION = TOTAL_CHARS / CHARS_PER_SEC;
const LOOP_DURATION = TYPE_DURATION + HOLD_AFTER_TYPED;

export function createScreen() {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { alpha: false });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const state = { typing: 0, glow: 0, stage: "off" };
  let lastDraw = -Infinity;

  paintOff();

  function paintOff() {
    ctx.fillStyle = "#04050a";
    ctx.fillRect(0, 0, W, H);
  }

  function backdrop(brightness) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0a0d16");
    g.addColorStop(1, "#05060c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // pool of light behind the caret area
    const pool = ctx.createRadialGradient(W * 0.42, H * 0.45, 0, W * 0.42, H * 0.45, W * 0.7);
    pool.addColorStop(0, `rgba(120,150,220,${0.08 * brightness})`);
    pool.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = pool;
    ctx.fillRect(0, 0, W, H);
  }

  function overlay() {
    // scanlines
    ctx.fillStyle = "rgba(255,255,255,0.018)";
    for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

    // vignette
    const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, W * 0.72);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }

  function drawPowering(p) {
    paintOff();
    const sweep = ctx.createLinearGradient(0, H * (1 - p), 0, H);
    sweep.addColorStop(0, "rgba(160,185,255,0)");
    sweep.addColorStop(1, `rgba(160,185,255,${0.16 * p})`);
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, W, H);
  }

  function drawBoot(p) {
    backdrop(0.5);

    ctx.textBaseline = "alphabetic";
    ctx.font = `600 26px ${MONO}`;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fillText("RAYAT OS", 88, 168);

    ctx.font = `400 20px ${MONO}`;
    ctx.fillStyle = "rgba(255,255,255,0.30)";
    ctx.fillText("v2026.1", 248, 168);

    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillText("initializing system...", 88, 210);

    // progress track
    const barW = W - 176;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(88, 246, barW, 4);
    ctx.fillStyle = "rgba(214,228,255,0.85)";
    ctx.fillRect(88, 246, barW * easeOut(p), 4);

    // log lines revealed in step with the bar
    ctx.font = `400 19px ${MONO}`;
    BOOT_LOG.forEach((line, i) => {
      const at = (i + 0.4) / BOOT_LOG.length;
      if (p < at) return;
      const fade = Math.min(1, (p - at) * 9);
      ctx.fillStyle = `rgba(255,255,255,${0.30 * fade})`;
      ctx.fillText(`[ ok ] ${line}`, 88, 310 + i * 34);
    });

    overlay();
  }

  function drawEditor(loopT, now) {
    backdrop(1);

    // ── chrome ──
    ctx.fillStyle = "rgba(255,255,255,0.035)";
    ctx.fillRect(0, 0, W, 46);
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.fillRect(0, 46, W, 1);

    [0.16, 0.11, 0.11].forEach((a, i) => {
      ctx.beginPath();
      ctx.arc(34 + i * 26, 23, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();
    });

    ctx.font = `500 18px ${MONO}`;
    ctx.fillStyle = "rgba(255,255,255,0.32)";
    ctx.textAlign = "center";
    ctx.fillText("rayat.js — ~/portfolio", W / 2, 30);
    ctx.textAlign = "left";

    // ── code ──
    const revealed =
      loopT >= TYPE_DURATION ? TOTAL_CHARS : Math.floor(loopT * CHARS_PER_SEC);

    const x0 = 106;
    const y0 = 122;
    const lh = 48;
    ctx.font = `400 24px ${MONO}`;
    const chW = ctx.measureText("M").width;

    const caret = caretAt(revealed);

    // active-line wash sits under the text
    ctx.fillStyle = "rgba(255,255,255,0.022)";
    ctx.fillRect(0, y0 + caret.line * lh - 32, W, lh);

    let consumed = 0;
    for (let i = 0; i < CODE_LINES.length; i++) {
      const y = y0 + i * lh;
      const len = LINE_LENGTHS[i];
      const drawn = clamp(revealed - consumed, 0, len);
      consumed += len;

      ctx.font = `400 18px ${MONO}`;
      ctx.fillStyle =
        i <= caret.line ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)";
      ctx.fillText(String(i + 1).padStart(2, "0"), 46, y);

      let x = x0;
      let rem = drawn;
      for (const [text, tone] of CODE_LINES[i]) {
        if (rem <= 0) break;
        const slice = text.slice(0, rem);
        ctx.font = `${tone === "cm" ? "italic " : ""}400 24px ${MONO}`;
        ctx.fillStyle = TONE[tone];
        ctx.fillText(slice, x, y);
        x += slice.length * chW;
        rem -= slice.length;
      }
    }

    const blink = loopT < TYPE_DURATION ? true : now % 1.06 < 0.62;
    if (blink) {
      ctx.fillStyle = "rgba(214,228,255,0.80)";
      ctx.fillRect(
        x0 + caret.col * chW + 2,
        y0 + caret.line * lh - 24,
        chW * 0.62,
        28,
      );
    }

    // ── status bar ──
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(0, H - 38, W, 38);
    ctx.font = `400 17px ${MONO}`;
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.fillText("~/portfolio", 28, H - 13);
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillText(
      loopT < TYPE_DURATION ? "● typing" : "● saved",
      W - 28,
      H - 13,
    );
    ctx.textAlign = "left";

    overlay();
  }

  /**
   * @param {number} t seconds since the scene mounted
   * @returns {void} mutates `state` every call; repaints at REDRAW_HZ
   */
  function update(t) {
    if (t < T_POWER) {
      state.stage = "off";
      state.glow = 0;
      state.typing = 0;
    } else if (t < T_BOOT) {
      state.stage = "powering";
      state.glow = (t - T_POWER) / (T_BOOT - T_POWER);
      state.typing = 0;
    } else if (t < T_EDITOR) {
      state.stage = "boot";
      state.glow = 0.55;
      state.typing = 0;
    } else {
      state.stage = "editor";
      state.glow = Math.min(1, 0.55 + (t - T_EDITOR) * 1.2);
      const loopT = (t - T_EDITOR) % LOOP_DURATION;
      // ramp in/out of the hold so the hands settle rather than snap
      state.typing =
        loopT < TYPE_DURATION
          ? 1
          : Math.max(0, 1 - (loopT - TYPE_DURATION) / 0.45) * 0.9;
    }

    if (t - lastDraw < 1 / REDRAW_HZ) return;
    lastDraw = t;

    if (state.stage === "off") paintOff();
    else if (state.stage === "powering") drawPowering(state.glow);
    else if (state.stage === "boot") drawBoot((t - T_BOOT) / (T_EDITOR - T_BOOT));
    else drawEditor((t - T_EDITOR) % LOOP_DURATION, t);

    texture.needsUpdate = true;
  }

  /** Jump straight to the finished editor — used for reduced motion. */
  function settle() {
    state.stage = "editor";
    state.glow = 1;
    state.typing = 0;
    drawEditor(TYPE_DURATION, 0);
    texture.needsUpdate = true;
  }

  return { texture, state, update, settle, dispose: () => texture.dispose() };
}

function easeOut(x) {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
}
