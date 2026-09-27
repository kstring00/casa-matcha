/** Tiny typed event bus for cross-component moments (curtain done, hero loaded, splash burst). */
type Events = {
  "intro:done": undefined;
  "hero:loaded": undefined;
  "hero:burst": { strength: number };
  "nav:theme": "light" | "dark";
};

type Handler<K extends keyof Events> = (payload: Events[K]) => void;
const listeners = new Map<keyof Events, Set<Handler<keyof Events>>>();

export const bus = {
  on<K extends keyof Events>(key: K, handler: Handler<K>): () => void {
    const set = listeners.get(key) ?? new Set();
    set.add(handler as Handler<keyof Events>);
    listeners.set(key, set);
    return () => set.delete(handler as Handler<keyof Events>);
  },
  emit<K extends keyof Events>(key: K, payload?: Events[K]) {
    listeners.get(key)?.forEach((h) => h(payload as Events[K]));
  },
};

export const introState = { done: false, heroLoaded: false };

/** Run after the brand curtain has left (or immediately when it was skipped). */
export function whenIntroDone(cb: () => void): () => void {
  if (introState.done) {
    cb();
    return () => {};
  }
  const off = bus.on("intro:done", () => {
    off();
    cb();
  });
  return off;
}

/** Intro finished AND the main thread is idle: the moment to start deferred work. */
export function afterIntroIdle(cb: () => void, timeout = 2000): () => void {
  let cancelIdle: (() => void) | null = null;
  const off = whenIntroDone(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(cb, { timeout });
      cancelIdle = () => window.cancelIdleCallback(id);
    } else {
      const id = window.setTimeout(cb, 300);
      cancelIdle = () => window.clearTimeout(id);
    }
  });
  return () => {
    off();
    cancelIdle?.();
  };
}

export function markIntroDone() {
  if (introState.done) return;
  introState.done = true;
  bus.emit("intro:done");
}
