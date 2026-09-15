/**
 * Module-level scene state.
 *
 * The R3F canvas runs in its own reconciler root, so React context does not
 * cross the boundary. Anything the 3D scene needs to share frame-to-frame
 * (typing intensity, pointer, route dimming) lives here as plain mutable
 * state — read inside useFrame, never during render.
 */
export const sceneState = {
  /** 0 → hands resting, 1 → hammering the keys. Driven by the screen texture. */
  typing: 0,
  /** Screen brightness 0 → 1 across the boot sequence. */
  glow: 0,
  /** Normalised pointer, -1 → 1 on both axes. */
  pointerX: 0,
  pointerY: 0,
  /** Scroll progress of the active route, 0 → 1. */
  scroll: 0,
  /**
   * Honour prefers-reduced-motion: freezes idle motion, keeps the pose.
   * Resolved at module load, not in an effect — child effects run before the
   * parent's, so the scene would otherwise read a stale `false` on mount.
   */
  reducedMotion:
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  /**
   * Timestamp of the last keypress for each of the eight typing fingers.
   * The keyboard writes it, the hands read it — that is what keeps the
   * fingers landing on the same beat as the characters on screen.
   */
  strokes: new Float32Array(8),
};

export function emitKeystroke(finger, time) {
  sceneState.strokes[finger] = time;
}
