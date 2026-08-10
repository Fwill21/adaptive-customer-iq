import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import type { Detail } from "@/lib/story-data";
import { OttoMark } from "./primitives";
import { Check, X } from "lucide-react";

/* ─────────────── Action buttons (all CTAs are real buttons) ─────────────── */

export function ActionButton({
  children,
  onClick,
  variant = "outline",
  done,
  doneLabel,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "outline" | "solid";
  done?: boolean;
  doneLabel?: string;
  className?: string;
}) {
  if (done) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-otto/30 bg-otto-soft px-3 py-1.5 text-[12px] font-medium text-otto",
          className,
        )}
      >
        <Check className="size-3.5" aria-hidden="true" />
        {doneLabel ?? "Done"}
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors",
        variant === "solid"
          ? "bg-primary text-primary-foreground hover:opacity-90"
          : "border border-border hover:border-border-strong hover:bg-background",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ─────────────── Slide-over detail panel ─────────────── */

export function DetailDrawer({
  detail,
  onClose,
  onConfirm,
  confirmed,
  footer,
}: {
  detail: Detail | null;
  onClose: () => void;
  onConfirm?: () => void;
  confirmed?: boolean;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail, onClose]);

  if (!detail || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/15 backdrop-blur-[2px]"
      />
      <aside
        role="dialog"
        aria-label={detail.title}
        className="soft-in relative flex h-full w-[min(30rem,100vw)] flex-col overflow-y-auto border-l border-border bg-surface shadow-lift"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="min-w-0">
            <h2 className="text-[1.1rem] font-semibold leading-snug tracking-tight">
              {detail.title}
            </h2>
            {detail.meta && (
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {detail.meta}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-7 px-6 py-6">
          {detail.summary && (
            <div className="flex gap-3 rounded-xl border border-otto/25 bg-otto-soft px-4 py-3.5">
              <span className="mt-0.5 shrink-0 text-otto">
                <OttoMark size={16} />
              </span>
              <p className="text-[14px] leading-relaxed">{detail.summary}</p>
            </div>
          )}

          {detail.sections.map((s) => (
            <div key={s.label}>
              <span className="eyebrow">{s.label}</span>
              <ul className="mt-3 space-y-2.5">
                {s.items.map((it) => (
                  <li key={it} className="flex gap-3 text-[14px] leading-snug">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-agent" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {footer}
        </div>

        {detail.confirm && (
          <div className="sticky bottom-0 border-t border-border bg-surface px-6 py-4">
            {confirmed ? (
              <p className="flex items-center gap-2 text-[13px] font-medium text-otto">
                <Check className="size-4" aria-hidden="true" /> {detail.confirm} — confirmed. Context
                updated across the account team.
              </p>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onConfirm}
                  className="rounded-lg bg-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground hover:opacity-90"
                >
                  {detail.confirm}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-border px-4 py-2.5 text-[13px] font-medium"
                >
                  Not now
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>,
    document.body,
  );
}

/** Drawer state helper: open a detail, confirm it, remember what was confirmed. */
export function useDrawer() {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [confirmedKeys, setConfirmedKeys] = useState<string[]>([]);
  const [key, setKey] = useState<string | null>(null);

  const open = (k: string, d: Detail) => {
    setKey(k);
    setDetail(d);
  };
  const close = () => setDetail(null);
  const confirm = () => {
    if (key && !confirmedKeys.includes(key)) setConfirmedKeys((c) => [...c, key]);
  };
  const isConfirmed = (k: string) => confirmedKeys.includes(k);

  return {
    detail,
    open,
    close,
    confirm,
    isConfirmed,
    confirmed: key ? confirmedKeys.includes(key) : false,
  };
}

/** Convenience wrapper: returns an opener plus the drawer element to render. */
export function useInfoDrawer() {
  const drawer = useDrawer();
  return {
    open: drawer.open,
    node: (
      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    ),
  };
}
