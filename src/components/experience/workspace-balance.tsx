/**
 * Workspace balance control — one continuous workspace, from full Otto
 * conversation (0) through hybrid (50) to full adaptive UI (100).
 *
 * The control lives in the workspace chrome and owns nothing but the balance
 * number; every layout decision derives from it, so context is never reset.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const SNAPS = [0, 50, 100] as const;

/** Otto's share of the workspace (0–1) for a given balance value. */
export function ottoShare(balance: number): number {
  if (balance <= 50) return 1 - (balance / 50) * 0.63; // 100% → 37%
  return 0.37 * (1 - (balance - 50) / 50); // 37% → 0%
}

export type OttoVariant = "wide" | "standard" | "condensed" | "minimal";

export function ottoVariant(balance: number): OttoVariant {
  if (balance < 18) return "wide";
  if (balance < 58) return "standard";
  if (balance < 88) return "condensed";
  return "minimal";
}

export type CanvasDensity = "hidden" | "compact" | "medium" | "full";

export function canvasDensity(balance: number): CanvasDensity {
  if (balance < 8) return "hidden";
  if (balance < 40) return "compact";
  if (balance < 78) return "medium";
  return "full";
}

export function balanceLabel(balance: number): string {
  if (balance < 12) return "Conversational";
  if (balance < 40) return "Conversation-forward";
  if (balance < 62) return "Hybrid";
  if (balance < 88) return "UI-forward";
  return "UI";
}

export function WorkspaceBalance({
  value,
  onChange,
  onCommit,
  onDragChange,
}: {
  value: number;
  onChange: (v: number) => void;
  /** Called on release, after snapping. */
  onCommit?: (v: number) => void;
  onDragChange?: (dragging: boolean) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const fromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    return Math.round(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => onChange(fromClientX(e.clientX));
    const up = (e: PointerEvent) => {
      const raw = fromClientX(e.clientX);
      const snap = SNAPS.find((s) => Math.abs(raw - s) <= 7);
      const next = snap ?? raw;
      setDragging(false);
      onDragChange?.(false);
      onChange(next);
      onCommit?.(next);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [dragging, fromClientX, onChange, onCommit, onDragChange]);

  const key = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 5;
    let next: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = value - step;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = value + step;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = 100;
    if (e.key === "PageDown") next = 0;
    if (e.key === "PageUp") next = 100;
    if (next === null) return;
    e.preventDefault();
    const clamped = Math.min(100, Math.max(0, next));
    onChange(clamped);
    onCommit?.(clamped);
  };

  const labels: Array<{ text: string; at: number }> = [
    { text: "Conversational", at: 0 },
    { text: "Hybrid", at: 50 },
    { text: "UI", at: 100 },
  ];

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="w-[15rem] shrink-0 sm:w-[19rem]">
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label="Workspace balance between Otto conversation and the adaptive interface"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={balanceLabel(value)}
          aria-orientation="horizontal"
          onKeyDown={key}
          onPointerDown={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement).focus();
            onChange(fromClientX(e.clientX));
            setDragging(true);
            onDragChange?.(true);
          }}
          className="group relative h-4 cursor-ew-resize touch-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-otto/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {/* thin neutral track */}
          <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-border" />
          {/* interaction state */}
          <div
            className={cn(
              "absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-otto/55",
              !dragging && "transition-[width,left] duration-200 ease-out",
            )}
            style={{
              left: `${Math.min(value, 50)}%`,
              width: `${Math.abs(value - 50)}%`,
            }}
          />
          {/* snap ticks */}
          {SNAPS.map((s) => (
            <span
              key={s}
              aria-hidden="true"
              className="absolute top-1/2 size-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/45"
              style={{ left: `${s}%` }}
            />
          ))}
          {/* thumb */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-1/2 h-4 w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-otto/50 bg-surface shadow-calm",
              dragging ? "bg-otto" : "group-hover:border-otto",
              !dragging && "transition-[left] duration-200 ease-out",
            )}
            style={{ left: `${value}%` }}
          />
        </div>

        <div className="relative mt-1 h-3">
          {labels.map((l) => {
            const active = balanceLabel(value) === l.text;
            return (
              <button
                key={l.text}
                type="button"
                onClick={() => {
                  onChange(l.at);
                  onCommit?.(l.at);
                }}
                style={{ left: `${l.at}%` }}
                className={cn(
                  "absolute -translate-x-1/2 whitespace-nowrap text-[10px] tracking-[0.02em] transition-colors first:translate-x-0 last:-translate-x-full",
                  active ? "font-semibold text-otto" : "text-muted-foreground hover:text-foreground",
                  l.at === 0 && "translate-x-0",
                  l.at === 100 && "-translate-x-full",
                )}
              >
                {l.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
