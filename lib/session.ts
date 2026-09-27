const PREFIX = "cm:";

export function sessionGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function sessionSet(key: string, value = "1") {
  try {
    window.sessionStorage.setItem(PREFIX + key, value);
  } catch {
    /* private mode etc. */
  }
}

/** Returns true the first time a key is seen in this tab session. */
export function onceInSession(key: string): boolean {
  if (sessionGet(key)) return false;
  sessionSet(key);
  return true;
}

export function clearSessionFlags() {
  try {
    Object.keys(window.sessionStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.sessionStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}
