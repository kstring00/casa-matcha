"use client";

export type FrameManifest = { fps: number; total: number; width: number; height: number; frames: number[] };

export const frameUrl = (dir: string, n: number) => `${dir}/f-${String(n).padStart(3, "0")}.webp`;

/**
 * Scroll progress (0..1) → source frame number (1..total), piecewise so the
 * choreography lands on the video's beats: still → pour → splash → settle.
 * Each segment is eased slightly (blend of linear and power1.inOut) so the
 * splash arrives with weight instead of a linear tick.
 */
const KEYS: [number, number][] = [
  [0, 1],
  [0.15, 9],
  [0.5, 53],
  [0.55, 57],
  [0.8, 85],
  [1, 97],
];
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function progressToFrame(p: number, total = 97): number {
  const scale = (total - 1) / 96;
  const x = Math.min(1, Math.max(0, p));
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [p0, f0] = KEYS[i];
    const [p1, f1] = KEYS[i + 1];
    if (x <= p1) {
      const t = (x - p0) / (p1 - p0);
      const e = t * 0.5 + easeInOut(t) * 0.5;
      return 1 + (f0 - 1 + (f1 - f0) * e) * scale;
    }
  }
  return total;
}

/** Nearest available frame in a sorted manifest list. Returns the index into `frames`. */
export function nearestIndex(frames: number[], target: number): number {
  let lo = 0;
  let hi = frames.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (frames[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  if (lo > 0 && Math.abs(frames[lo - 1] - target) <= Math.abs(frames[lo] - target)) return lo - 1;
  return lo;
}

/** Order that fills the timeline coarsely first: poster, last, midpoints, ... */
function subdivisionOrder(n: number): number[] {
  const seen = new Set<number>([0]);
  const out = [0];
  if (n > 1) {
    seen.add(n - 1);
    out.push(n - 1);
  }
  const queue: [number, number][] = [[0, n - 1]];
  while (queue.length) {
    const [a, b] = queue.shift()!;
    const mid = (a + b) >> 1;
    if (mid === a || mid === b) continue;
    if (!seen.has(mid)) {
      seen.add(mid);
      out.push(mid);
    }
    queue.push([a, mid], [mid, b]);
  }
  for (let i = 0; i < n; i++) if (!seen.has(i)) out.push(i);
  return out;
}

export class FrameLoader {
  readonly images: (HTMLImageElement | null)[];
  readonly loaded: boolean[];
  count = 0;
  private destroyed = false;
  private queue: number[];
  private inflight = 0;

  constructor(
    private dir: string,
    readonly manifest: FrameManifest,
    private onProgress: (fraction: number, index: number) => void,
    private onDone: () => void,
    private concurrency = 4,
  ) {
    this.images = new Array(manifest.frames.length).fill(null);
    this.loaded = new Array(manifest.frames.length).fill(false);
    this.queue = subdivisionOrder(manifest.frames.length);
  }

  /**
   * Poster first, alone and at high priority. The rest wait for `gate` (the
   * hero passes "intro finished + idle") or the first scroll, whichever comes
   * first, so ~1 MB of frames never competes with the app bundle or the LCP.
   */
  start(gate: (cb: () => void) => () => void) {
    const first = this.queue.shift()!;
    this.load(first, "high");
    let started = false;
    const go = () => {
      if (started || this.destroyed) return;
      started = true;
      window.removeEventListener("scroll", go);
      cancelGate();
      this.pump();
    };
    window.addEventListener("scroll", go, { passive: true, once: true });
    const cancelGate = gate(go);
  }

  private pump() {
    while (!this.destroyed && this.inflight < this.concurrency && this.queue.length) {
      const i = this.queue.shift()!;
      this.load(i, "low");
    }
  }

  private load(i: number, priority: "high" | "low") {
    this.inflight++;
    const img = new Image();
    img.decoding = "async";
    (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = priority;
    const done = () => {
      this.inflight--;
      if (this.destroyed) return;
      this.images[i] = img;
      this.loaded[i] = true;
      this.count++;
      this.onProgress(this.count / this.images.length, i);
      if (this.count === this.images.length) this.onDone();
      this.pump();
    };
    return new Promise<void>((resolve) => {
      img.onload = () => {
        img.decode().catch(() => {}).finally(() => {
          done();
          resolve();
        });
      };
      img.onerror = () => {
        this.inflight--;
        resolve();
        this.pump();
      };
      img.src = frameUrl(this.dir, this.manifest.frames[i]);
    });
  }

  /** Index of the closest loaded frame to a source frame number, or -1. */
  nearestLoaded(sourceFrame: number): number {
    const idx = nearestIndex(this.manifest.frames, sourceFrame);
    if (this.loaded[idx]) return idx;
    for (let d = 1; d < this.images.length; d++) {
      if (this.loaded[idx - d]) return idx - d;
      if (this.loaded[idx + d]) return idx + d;
    }
    return -1;
  }

  destroy() {
    this.destroyed = true;
    this.queue = [];
  }
}

/** object-fit: cover with an object-position focal point, on a 2D canvas. */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
  fx = 0.5,
  fy = 0.38,
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const s = Math.max(cw / iw, ch / ih);
  const dw = iw * s;
  const dh = ih * s;
  ctx.drawImage(img, (cw - dw) * fx, (ch - dh) * fy, dw, dh);
}
