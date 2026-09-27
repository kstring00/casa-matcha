"use client";
import { Logo } from "@/components/brand/Logo";

export type BrandToastProps = {
  title: string;
  body?: string;
  action?: { label: string; onClick?: () => void; href?: string; external?: boolean };
  duration: number;
  toastId: string | number;
};

export function BrandToast({ title, body, action, duration, toastId }: BrandToastProps) {
  const dismiss = () => {
    import("sonner").then(({ toast }) => toast.dismiss(toastId));
  };
  const actionClass =
    "mt-2 inline-flex items-center gap-1 rounded-full bg-matcha px-3 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-matcha-light";
  return (
    <div className="brand-toast" style={{ ["--toast-duration" as string]: `${duration}ms` }}>
      <span className="brand-toast__mark" aria-hidden="true">
        <Logo variant="mark" className="h-9 w-9" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[1.05rem] leading-tight font-semibold text-ink">{title}</p>
        {body && <p className="mt-0.5 text-[0.82rem] leading-snug text-ink/75">{body}</p>}
        {action &&
          (action.href ? (
            <a
              href={action.href}
              onClick={dismiss}
              className={actionClass}
              {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {action.label} <span aria-hidden="true">→</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => {
                action.onClick?.();
                dismiss();
              }}
              className={actionClass}
            >
              {action.label} <span aria-hidden="true">→</span>
            </button>
          ))}
      </div>
      <button type="button" onClick={dismiss} aria-label="Dismiss notification" className="brand-toast__close">
        ×
      </button>
      <span className="brand-toast__bar" aria-hidden="true" />
    </div>
  );
}
