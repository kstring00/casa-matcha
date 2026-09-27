"use client";
import { useSyncExternalStore } from "react";
import { defaultLocationId, type LocationId } from "@/content/locations";
import { sessionGet, sessionSet } from "./session";

let current: LocationId | null = null;
const subs = new Set<() => void>();

function read(): LocationId {
  if (current) return current;
  const saved = sessionGet("loc");
  current = saved === "friendswood" || saved === "webster" ? saved : defaultLocationId;
  return current;
}

export const locationStore = {
  get: read,
  set(id: LocationId) {
    current = id;
    sessionSet("loc", id);
    subs.forEach((f) => f());
  },
  subscribe(cb: () => void) {
    subs.add(cb);
    return () => {
      subs.delete(cb);
    };
  },
};

export function useSelectedLocation(): [LocationId, (id: LocationId) => void] {
  const id = useSyncExternalStore(locationStore.subscribe, locationStore.get, () => defaultLocationId);
  return [id, locationStore.set];
}
