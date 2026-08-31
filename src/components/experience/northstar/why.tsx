/**
 * Inspectable reasoning — "why surfaced".
 *
 * Any AI conclusion in the Northstar story can be expanded to show which agent
 * concluded it, what it read, how it reasoned, what it ruled out, and the
 * underlying evidence. Evidence opens in place, so the trail never leaves the
 * conclusion it belongs to.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import { EVIDENCE, WHY_TRAILS, type EvidenceId, type TrailId } from "@/lib/northstar-data";
import { ActionButton } from "../drawer";
import { Surface } from "../shell";
import { Bell, ChevronDown, Paperclip, Sparkles, X } from "lucide-react";

/** Evidence detail, rendered inline beneath whatever cited it. */
export function EvidenceDetail({ id, onClose }: { id: EvidenceId; onClose: () => void }) {
  const e = EVIDENCE[id];
  return (
    <div className="soft-in rounded-xl border border-otto/30 bg-otto-soft/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-otto">{e.label}</p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {e.source} · {e.when}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close evidence"
          onClick={onClose}
          className="rounded-md border border-border p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      </div>
      <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed">
        {e.body.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Collapsible reasoning trail behind one conclusion.
 * `tone="inline"` is the compact form used inside the Otto conversation.
 */
export function WhyTrail({
  id,
  label = "Why surfaced",
  tone = "surface",
  defaultOpen = false,
}: {
  id: TrailId;
  label?: string;
  tone?: "surface" | "inline";
  defaultOpen?: boolean;
}) {
  const trail = WHY_TRAILS[id];
  const [open, setOpen] = useState(defaultOpen);
  const [evidence, setEvidence] = useState<EvidenceId | null>(null);

  const body = (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-otto">
          <Sparkles className="size-3" aria-hidden="true" /> {label}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className={cn("soft-in space-y-3", tone === "inline" ? "mt-2" : "mt-3")}>
          <p className="text-[13.5px] font-medium leading-relaxed">{trail.conclusion}</p>

          <dl className="grid gap-1 text-[12px] text-muted-foreground">
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-mono text-[10px] uppercase tracking-[0.12em]">Concluded by</dt>
              <dd className="text-foreground">{trail.agent}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="font-mono text-[10px] uppercase tracking-[0.12em]">Confidence</dt>
              <dd>{trail.confidence}</dd>
            </div>
          </dl>

          <Section title="What it read">
            <ul className="space-y-1.5">
              {trail.inputs.map((i) => (
                <li key={i.label} className="text-[12.5px] text-muted-foreground">
                  <span className="text-foreground">{i.label}</span> · {i.detail}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="How it reasoned">
            <ol className="space-y-1.5 border-l border-otto/25 pl-3">
              {trail.reasoning.map((r, i) => (
                <li key={r} className="text-[12.5px] leading-snug">
                  <span className="mr-1.5 font-mono text-[10px] text-otto">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {r}
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Ruled out">
            <ul className="space-y-1.5">
              {trail.ruledOut.map((r) => (
                <li key={r} className="flex gap-2 text-[12.5px] leading-snug text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-border-strong" />
                  {r}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Evidence">
            <div className="flex flex-wrap gap-1.5">
              {trail.evidence.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEvidence((prev) => (prev === e ? null : e))}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors",
                    evidence === e
                      ? "border-otto/50 text-otto"
                      : "border-border text-muted-foreground hover:border-otto/50 hover:text-otto",
                  )}
                >
                  <Paperclip className="size-3" aria-hidden="true" />
                  {EVIDENCE[e].label}
                </button>
              ))}
            </div>
            {evidence && (
              <div className="mt-2">
                <EvidenceDetail id={evidence} onClose={() => setEvidence(null)} />
              </div>
            )}
          </Section>
        </div>
      )}
    </>
  );

  if (tone === "inline") {
    return <div className="rounded-lg border border-otto/25 bg-otto-soft/30 p-2.5">{body}</div>;
  }
  return <Surface className="space-y-0">{body}</Surface>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 border-t border-border pt-2.5">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

/**
 * Proactive notification: LUX brings the customer to Maya before she navigates
 * to the account. Reasoning is inspectable from the notification itself.
 */
export function NorthstarNotification({
  alert,
  onOpen,
  onDismiss,
}: {
  alert: {
    agent: string;
    at: string;
    headline: string;
    support: string;
    bullets: string[];
    trail: TrailId;
    open: string;
    later: string;
  };
  onOpen: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      role="alertdialog"
      aria-label="Proactive priority signal"
      className="rise fixed bottom-16 right-5 z-40 w-[min(24rem,calc(100vw-2.5rem))]"
    >
      <Surface className="space-y-3 border-signal/40 shadow-lift">
        <div className="flex items-start justify-between gap-3">
          <p className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-signal">
            <Bell className="size-3" aria-hidden="true" /> {alert.agent}
          </p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={onDismiss}
            className="rounded-md border border-border p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        </div>

        <div>
          <p className="text-[14.5px] font-semibold leading-snug tracking-tight">
            {alert.headline}
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">{alert.at}</p>
        </div>

        <p className="text-[13px] leading-relaxed text-muted-foreground">{alert.support}</p>

        <ul className="space-y-1.5 border-y border-border py-2.5">
          {alert.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-[12.5px] leading-snug">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-signal" />
              {b}
            </li>
          ))}
        </ul>

        <WhyTrail id={alert.trail} tone="inline" label="Why you are being pulled in" />

        <div className="flex flex-wrap gap-2">
          <ActionButton variant="primary" onClick={onOpen}>
            {alert.open}
          </ActionButton>
          <ActionButton variant="tertiary" onClick={onDismiss}>
            {alert.later}
          </ActionButton>
        </div>
      </Surface>
    </div>
  );
}
