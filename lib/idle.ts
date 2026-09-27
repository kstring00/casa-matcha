/** Run work after the browser is idle (or after `timeout` ms, whichever first). Returns a cancel fn. */
export function onIdle(cb: () => void, timeout = 1500): () => void {
  if (typeof window === "undefined") return () => {};
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(cb, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, Math.min(timeout, 200));
  return () => window.clearTimeout(id);
}
