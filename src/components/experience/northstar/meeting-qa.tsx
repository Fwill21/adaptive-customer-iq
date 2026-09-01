/* Meeting mode, live.
 *
 * Maya types the question the customer just asked in the room; Otto answers
 * from the customer's actual record. No canned answers — the response is
 * generated against the live rows and the grounding is inspectable. */

import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUp, ChevronDown, Loader2 } from "lucide-react";
import { OttoMark } from "../primitives";
import { askOttoInMeeting } from "@/lib/customer.functions";
import { useCustomerRecord } from "@/lib/customer-record";

type Turn = {
  id: number;
  question: string;
  answer: string;
  grounding: string[];
  error?: string;
  pending?: boolean;
};

export function LiveMeetingQa({
  suggestions,
  slug,
}: {
  suggestions: string[];
  slug?: string;
}) {
  const ask = useServerFn(askOttoInMeeting);
  const { record } = useCustomerRecord();
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [openGrounding, setOpenGrounding] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  const targetSlug = slug ?? record?.slug;

  async function submit(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    const id = nextId.current++;
    setTurns((t) => [...t, { id, question: q, answer: "", grounding: [], pending: true }]);
    setDraft("");
    setBusy(true);
    try {
      const res = await ask({ data: { question: q, ...(targetSlug ? { slug: targetSlug } : {}) } });
      setTurns((t) =>
        t.map((turn) =>
          turn.id === id
            ? {
                ...turn,
                pending: false,
                answer: res.answer,
                grounding: res.grounding,
                ...(res.error ? { error: res.error } : {}),
              }
            : turn,
        ),
      );
    } catch {
      setTurns((t) =>
        t.map((turn) =>
          turn.id === id
            ? { ...turn, pending: false, error: "Otto could not reach the record just now." }
            : turn,
        ),
      );
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <span className="eyebrow">Live in the room</span>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Type the question the customer just asked. Otto answers from
          {record ? ` ${record.name}'s` : " the customer's"} actual record — metrics, cases,
          stakeholders and the review narrative on file.
        </p>
      </div>

      {turns.length > 0 && (
        <ol className="space-y-5">
          {turns.map((turn) => (
            <li key={turn.id} className="space-y-3 border-t border-border pt-5">
              <p className="text-[1.02rem] font-medium leading-snug">“{turn.question}”</p>
              <div className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-otto">
                  <OttoMark size={16} />
                </span>
                {turn.pending ? (
                  <p className="flex items-center gap-2 text-[14px] text-muted-foreground">
                    <Loader2 size={14} className="animate-spin" />
                    Reading the record…
                  </p>
                ) : turn.error ? (
                  <p className="text-[14px] leading-relaxed text-muted-foreground">{turn.error}</p>
                ) : (
                  <p className="text-[15px] leading-relaxed">{turn.answer}</p>
                )}
              </div>

              {!turn.pending && turn.grounding.length > 0 && (
                <div className="pl-7">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGrounding((cur) => (cur === turn.id ? null : turn.id))
                    }
                    aria-expanded={openGrounding === turn.id}
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ChevronDown
                      size={12}
                      className={`transition-transform ${openGrounding === turn.id ? "rotate-180" : ""}`}
                    />
                    Answered from these records
                  </button>
                  {openGrounding === turn.id && (
                    <ul className="soft-in mt-3 space-y-2 rounded-lg border border-border bg-canvas p-4">
                      {turn.grounding.map((g, i) => (
                        <li key={i} className="text-[12.5px] leading-relaxed text-muted-foreground">
                          {g}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit(draft);
        }}
        className="flex items-center gap-2 rounded-full border border-border bg-canvas px-4 py-2"
      >
        <span className="text-otto">
          <OttoMark size={15} />
        </span>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask Otto the customer's question…"
          aria-label="Ask Otto the customer's question"
          className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!draft.trim() || busy}
          aria-label="Send question to Otto"
          className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground text-canvas transition-opacity disabled:opacity-35"
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : <ArrowUp size={14} />}
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => void submit(s)}
              className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[12.5px] transition-colors hover:border-otto hover:text-otto disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
