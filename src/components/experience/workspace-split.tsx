/**
 * The split IS the control.
 *
 * A single number — Otto's percentage of the workspace right of the LUX rail —
 * drives everything. The user manipulates it by dragging the vertical divider
 * between Otto and the adaptive canvas. No mode switch, no header slider.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";

/** Recommended hybrid default: Otto 38% / UI 62%. */
export const DEFAULT_SPLIT = 38;
/** Edge thresholds where the divider gently snaps into a full mode. */
const COLLAPSE_LEFT = 9;
const COLLAPSE_RIGHT = 91;

export type OttoVariant = "hidden" | "condensed" | "standard" | "wide";

export function ottoVariant(pct: number): OttoVariant {
  if (pct <= 0) return "hidden";
  if (pct < 26) return "condensed";
  if (pct < 62) return "standard";
  return "wide";
}

export type CanvasDensity = "hidden" | "compact" | "medium" | "full";

export function canvasDensity(pct: number): CanvasDensity {
  const ui = 100 - pct;
  if (ui <= 0) return "hidden";
  if (ui < 30) return "compact";
  if (ui < 62) return "medium";
  return "full";
}

export function splitLabel(pct: number): string {
  if (pct <= 0) return "Full UI";
  if (pct >= 100) return "Full chat";
  return `Otto ${Math.round(pct)}% · Workspace ${100 - Math.round(pct)}%`;
}

/**
 * The draggable boundary. Rendered between the two panels; also used (with
 * `edge`) as the reveal affordance when one side is fully collapsed.
 */
export function WorkspaceDivider({
  value,
  onChange,
  onDragChange,
  containerRef,
  edge,
}: {
  value: number;
  onChange: (v: number) => void;
  onDragChange?: (dragging: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** "left" reveals Otto in full UI mode, "right" reveals the canvas in full chat. */
  edge?: "left" | "right";
}) {
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fromClientX = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return value;
      const r = el.getBoundingClientRect();
      return Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    },
    [containerRef, value],
  );

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => {
      e.preventDefault();
      onChange(fromClientX(e.clientX));
    };
    const up = (e: PointerEvent) => {
      const raw = fromClientX(e.clientX);
      setDragging(false);
      onDragChange?.(false);
      onChange(raw < COLLAPSE_LEFT ? 0 : raw > COLLAPSE_RIGHT ? 100 : raw);
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, fromClientX, onChange, onDragChange]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    let next: number | null = null;
    if (e.key === "ArrowLeft") next = value - step;
    if (e.key === "ArrowRight") next = value + step;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = 100;
    if (next === null) return;
    e.preventDefault();
    onChange(Math.min(100, Math.max(0, next)));
  };

  const active = dragging || hover;

  return (
    <div
      ref={ref}
      role="separator"
      tabIndex={0}
      aria-label="Adjust Otto and workspace width"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      aria-valuetext={splitLabel(value)}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onPointerDown={(e) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).focus();
        setDragging(true);
        onDragChange?.(true);
      }}
      onDoubleClick={() => onChange(DEFAULT_SPLIT)}
      className={cn(
        "group relative z-10 flex w-2 shrink-0 cursor-col-resize touch-none select-none items-center justify-center outline-none",
        "focus-visible:ring-2 focus-visible:ring-otto/60",
      )}
    >
      {/* the line itself — a native workspace boundary, not a control */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition-colors duration-150",
          dragging ? "bg-otto/70" : active ? "bg-border-strong" : "bg-border",
        )}
      />
      {/* central grab affordance, only on hover / drag */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none relative flex h-7 items-center justify-center rounded-full border bg-surface text-muted-foreground opacity-0 shadow-calm transition-opacity duration-150",
          edge ? "w-5" : "w-3.5",
          dragging ? "border-otto/60 text-otto opacity-100" : "border-border",
          active && "opacity-100",
          edge && "opacity-100",
        )}
      >
        {edge === "left" ? (
          <ChevronRight className="size-3" />
        ) : edge === "right" ? (
          <ChevronLeft className="size-3" />
        ) : (
          <GripVertical className="size-3" />
        )}
      </span>
    </div>
  );
}
