/**
 * Transition and closing screens for "A Quarter in the Life of a CSM".
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TRANSITION_REVEALS, TODAY_SCATTER } from "@/lib/northstar-data";
import { ActionButton } from "../drawer";
import { Chip } from "../lux";
import { Surface } from "../shell";
import { ArrowRight } from "lucide-react";

export function TransitionScreen({ onNext }: { onNext: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const all = revealed >= TRANSITION_REVEALS.length;

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-6">
      <header className="soft-in space-y-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-otto">Transition</p>
        <h1 className="text-balance text-[2rem] font-semibold leading-tight tracking-tight md:text-[2.4rem]">
          The opportunity is bigger than automating the QBR deck.
        </h1>
        <p className="text-balance text-[16px] leading-relaxed text-muted-foreground">
          Maya successfully moved the customer forward. But much of the work required her to act as
          the connective tissue between systems, data, artifacts, workflows, conversations and
          people.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {TODAY_SCATTER.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </header>

      <Surface className="space-y-4">
        <ul className="space-y-3">
          {TRANSITION_REVEALS.map((r, i) => (
            <li
              key={r}
              className={cn(
                "flex gap-3 text-[15.5px] leading-relaxed transition-opacity duration-500",
                i < revealed ? "text-foreground opacity-100" : "text-muted-foreground/35 opacity-60",
              )}
            >
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-otto" />
              {r}
            </li>
          ))}
        </ul>
        {!all && (
          <ActionButton variant="ai" onClick={() => setRevealed((v) => v + 1)}>
            {revealed === 0 ? "Ask the bigger question" : "Keep going"}
          </ActionButton>
        )}
      </Surface>

      {all && (
        <div className="soft-in text-center">
          <ActionButton variant="primary" onClick={onNext} className="h-11 px-6 text-[14px]">
            Reimagine this quarter on LUX
            <ArrowRight className="size-4" aria-hidden="true" />
          </ActionButton>
        </div>
      )}
    </div>
  );
}

export function WrapUpScreen({
  onRestart,
  onQbrPath,
}: {
  onRestart: () => void;
  onQbrPath: () => void;
}) {
  const connects = [
    "systems",
    "signals",
    "people",
    "artifacts",
    "workflows",
    "customer context",
  ];
  return (
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      <header className="space-y-3 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-otto">The takeaway</p>
        <h1 className="text-balance text-[1.9rem] font-semibold leading-tight tracking-tight md:text-[2.3rem]">
          The CSM should no longer be the integration layer.
        </h1>
        <p className="text-balance text-[15.5px] leading-relaxed text-muted-foreground">
          LUX becomes the integration layer so the CSM can focus on customer judgment, strategy and
          outcomes.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <Surface className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Today
          </p>
          <p className="text-[15px] font-semibold">Maya connected</p>
          <ul className="space-y-1.5 text-[14px] text-muted-foreground">
            {connects.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Surface>
        <Surface className="space-y-3 border-otto/30">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-otto">
            Reimagined on LUX
          </p>
          <p className="text-[15px] font-semibold">LUX connects</p>
          <ul className="space-y-1.5 text-[14px] text-muted-foreground">
            {connects.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="border-t border-border pt-3 text-[15px] font-semibold">Maya focuses on</p>
          <div className="flex flex-wrap gap-2">
            {["judgment", "strategy", "relationships", "customer outcomes"].map((c) => (
              <Chip key={c} tone="positive">
                {c}
              </Chip>
            ))}
          </div>
        </Surface>
      </div>

      <Surface className="flex flex-wrap items-center justify-between gap-4 border-otto/25 bg-otto-soft">
        <p className="max-w-xl text-[15px] leading-relaxed">
          This is not simply a faster QBR. It is a different operating model for Customer Success.
        </p>
        <div className="flex flex-wrap gap-2">
          <ActionButton variant="secondary" onClick={onRestart}>
            Restart demo
          </ActionButton>
          <ActionButton variant="primary" onClick={onQbrPath}>
            Go deeper: AI-Native QBR
          </ActionButton>
        </div>
      </Surface>
    </div>
  );
}
