import { PATHS, type PathId } from "@/lib/qbr-data";
import { OttoMark } from "./primitives";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function PathSelector({ onSelect }: { onSelect: (path: PathId) => void }) {
  return (
    <main className="min-h-screen bg-background px-6 py-16 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl space-y-14">
        <header className="soft-in mx-auto max-w-3xl space-y-5 text-center">
          <p className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-otto">
            <OttoMark size={16} />
            CSP on LUX
          </p>
          <h1 className="text-balance text-[2rem] font-semibold leading-tight tracking-tight md:text-[2.6rem]">
            Explore the Future of Customer Success
          </h1>
          <p className="text-balance text-[16px] leading-relaxed text-muted-foreground">
            See how an AI-native customer success environment continuously understands customers,
            coordinates work, and turns intelligence into measurable value.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {PATHS.map((p, i) => (
            <section
              key={p.id}
              className="rise flex flex-col gap-7 rounded-2xl border border-border bg-surface p-8 shadow-calm md:p-10"
              style={{ animationDelay: `${i * 110}ms` }}
            >
              <div className="space-y-3">
                <span className="eyebrow">Path {i + 1}</span>
                <h2 className="text-[1.6rem] font-semibold leading-tight tracking-tight">
                  {p.label}
                </h2>
                <p className="text-[14px] font-medium text-otto">{p.subtitle}</p>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{p.description}</p>
              </div>

              <ol className="space-y-1.5 border-y border-border py-6">
                {p.steps.map((s) => (
                  <li key={s} className="flex gap-3 text-[14px] leading-snug">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-agent" />
                    {s}
                  </li>
                ))}
              </ol>

              <div className="space-y-3">
                <div>
                  <span className="eyebrow">Question it answers</span>
                  <p className="mt-1.5 text-[14px] leading-snug">{p.question}</p>
                </div>
                <div>
                  <span className="eyebrow">Best for demonstrating</span>
                  <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
                    {p.proves.join(" · ")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelect(p.id)}
                className="mt-auto inline-flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-calm transition-transform hover:-translate-y-px"
              >
                {p.cta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </section>
          ))}
        </div>

        <p className="text-center text-[13px] text-muted-foreground">
          Three views into the same operating model. You can change demo path at any time.{" "}
          <Link to="/records" className="underline decoration-border hover:text-foreground">
            Edit the customer records
          </Link>{" "}
          behind the story, or{" "}
          <Link to="/profile" className="underline decoration-border hover:text-foreground">
            open the CSM profile
          </Link>{" "}
          to set the avatar, notifications and workspace defaults.
        </p>

      </div>
    </main>
  );
}
