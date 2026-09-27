"use client";
import { useEffect } from "react";
import { toasts } from "@/lib/toasts";
import { afterIntroIdle } from "@/lib/bus";

export function LostToast() {
  useEffect(() => {
    return afterIntroIdle(() => {
      window.setTimeout(() => toasts.lost(), 600);
    }, 1500);
  }, []);
  return null;
}
