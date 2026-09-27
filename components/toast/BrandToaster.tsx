"use client";
import { Toaster } from "sonner";

export function BrandToaster() {
  return (
    <Toaster
      position="bottom-center"
      visibleToasts={2}
      gap={10}
      offset={{ bottom: 24 }}
      mobileOffset={{ bottom: "calc(var(--bar-h) + env(safe-area-inset-bottom) + 12px)", left: 12, right: 12 }}
      toastOptions={{ unstyled: true, duration: 6500 }}
      containerAriaLabel="Notifications"
    />
  );
}
