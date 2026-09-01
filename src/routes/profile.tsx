import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Check, Loader2, Plus, Save, Trash2 } from "lucide-react";
import {
  DEFAULT_CSM_SLUG,
  getCsmProfile,
  saveCsmProfile,
  type EditableCsmProfile,
} from "@/lib/csm-profile.functions";

const title = "CSM profile — CSP on LUX";
const description =
  "Store the CSM's avatar, notification rules and workspace defaults as records, so the LUX workspace and Otto behave the way Maya configured them.";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] outline-none transition-colors focus:border-otto";

const TONES = ["green", "navy", "amber", "violet"] as const;
const MODES = ["conversational", "hybrid", "ui"] as const;
const MODE_LABEL: Record<string, string> = {
  conversational: "Conversational — Otto first",
  hybrid: "Hybrid — split screen",
  ui: "UI-driven — adaptive canvas first",
};

const TONE_CLASS: Record<string, string> = {
  green: "bg-otto/15 text-otto border-otto/40",
  navy: "bg-foreground/10 text-foreground border-border",
  amber: "bg-amber-500/15 text-amber-700 border-amber-500/40",
  violet: "bg-violet-500/15 text-violet-700 border-violet-500/40",
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="eyebrow">{label}</span>
      <input
        className={inputCls}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? <span className="block text-[12px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function Toggle({
  label,
  caption,
  checked,
  onChange,
}: {
  label: string;
  caption: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-start justify-between gap-4 rounded-xl border border-border bg-background p-4 text-left transition-colors hover:border-otto/50"
    >
      <span className="min-w-0">
        <span className="block text-[14px] font-medium">{label}</span>
        <span className="block text-[12px] leading-relaxed text-muted-foreground">{caption}</span>
      </span>
      <span
        className={`mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
          checked ? "border-otto bg-otto/20" : "border-border bg-surface"
        }`}
      >
        <span
          className={`mx-0.5 size-5 rounded-full transition-transform ${
            checked ? "translate-x-5 bg-otto" : "bg-muted-foreground/50"
          }`}
        />
      </span>
    </button>
  );
}

const EMPTY: EditableCsmProfile = {
  slug: DEFAULT_CSM_SLUG,
  name: "",
  roleTitle: "Customer Success Manager",
  email: null,
  avatarInitials: "MA",
  avatarTone: "green",
  timezone: "America/Los_Angeles",
  focusNote: null,
  defaultWorkMode: "hybrid",
  defaultSplit: 50,
  activityPulse: true,
  showDemoPath: true,
  proactiveNotifications: true,
  quietHours: null,
  notifications: [],
};

function ProfilePage() {
  const queryClient = useQueryClient();
  const fetchProfile = useServerFn(getCsmProfile);
  const persist = useServerFn(saveCsmProfile);

  const [draft, setDraft] = useState<EditableCsmProfile | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const profile = useQuery({
    queryKey: ["csm-profile-edit", DEFAULT_CSM_SLUG],
    queryFn: () => fetchProfile({ data: { slug: DEFAULT_CSM_SLUG } }),
  });

  useEffect(() => {
    if (profile.data === undefined) return;
    const p = profile.data;
    setDraft(
      p
        ? {
            slug: p.slug,
            name: p.name,
            roleTitle: p.roleTitle,
            email: p.email,
            avatarInitials: p.avatarInitials,
            avatarTone: p.avatarTone,
            timezone: p.timezone,
            focusNote: p.focusNote,
            defaultWorkMode: p.defaultWorkMode,
            defaultSplit: p.defaultSplit,
            activityPulse: p.activityPulse,
            showDemoPath: p.showDemoPath,
            proactiveNotifications: p.proactiveNotifications,
            quietHours: p.quietHours,
            notifications: p.notifications,
          }
        : { ...EMPTY },
    );
  }, [profile.data]);

  const save = useMutation({
    mutationFn: (record: EditableCsmProfile) => persist({ data: record }),
    onSuccess: async () => {
      setError(null);
      setStatus("Profile saved — the workspace reads these settings now.");
      await queryClient.invalidateQueries({ queryKey: ["csm-profile"] });
      await queryClient.invalidateQueries({ queryKey: ["csm-profile-edit"] });
    },
    onError: (e: unknown) =>
      setError(e instanceof Error ? e.message : "Could not save this profile."),
  });

  const set = <K extends keyof EditableCsmProfile>(key: K, value: EditableCsmProfile[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  return (
    <main className="min-h-screen bg-background px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to the experience
            </Link>
            <Link
              to="/records"
              className="text-[13px] text-muted-foreground underline decoration-border transition-colors hover:text-foreground"
            >
              Customer records
            </Link>
          </div>
          <h1 className="text-[2rem] font-semibold tracking-tight">CSM profile</h1>
          <p className="max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            The person running the workspace is a record too. Avatar, notification rules and
            workspace defaults are stored here, so the rail, the proactive signals and the
            Otto-to-UI balance behave the way this CSM configured them.
          </p>
        </header>

        {status ? (
          <p className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-[13px]">
            <Check className="size-4 text-otto" aria-hidden="true" />
            {status}
          </p>
        ) : null}
        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/40 bg-surface px-4 py-3 text-[13px] text-destructive"
          >
            {error}
          </p>
        ) : null}

        {profile.isLoading || !draft ? (
          <p className="text-[13px] text-muted-foreground">Loading profile…</p>
        ) : (
          <div className="space-y-6">
            {/* identity */}
            <section className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-calm">
              <header>
                <h2 className="text-[1.1rem] font-semibold tracking-tight">Identity &amp; avatar</h2>
                <p className="text-[13px] text-muted-foreground">
                  Shown in the global LUX rail and on every decision attributed to this CSM.
                </p>
              </header>

              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex size-14 items-center justify-center rounded-full border text-[16px] font-semibold ${
                    TONE_CLASS[draft.avatarTone] ?? TONE_CLASS["green"]
                  }`}
                  aria-hidden="true"
                >
                  {draft.avatarInitials.toUpperCase()}
                </span>
                <div className="space-y-1.5">
                  <span className="eyebrow">Avatar tone</span>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set("avatarTone", t)}
                        aria-pressed={draft.avatarTone === t}
                        className={`rounded-full border px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
                          draft.avatarTone === t
                            ? TONE_CLASS[t]
                            : "border-border text-muted-foreground hover:border-otto/50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" value={draft.name} onChange={(v) => set("name", v)} />
                <Field
                  label="Role title"
                  value={draft.roleTitle}
                  onChange={(v) => set("roleTitle", v)}
                />
                <Field
                  label="Avatar initials"
                  value={draft.avatarInitials}
                  onChange={(v) => set("avatarInitials", v.slice(0, 3))}
                  hint="Up to three characters."
                />
                <Field
                  label="Email"
                  value={draft.email ?? ""}
                  onChange={(v) => set("email", v || null)}
                />
                <Field
                  label="Time zone"
                  value={draft.timezone}
                  onChange={(v) => set("timezone", v)}
                />
                <Field
                  label="Profile key"
                  value={draft.slug}
                  onChange={(v) => set("slug", v)}
                  hint="Lowercase letters, numbers and dashes."
                />
              </div>

              <label className="block space-y-1.5">
                <span className="eyebrow">Focus note</span>
                <textarea
                  className={`${inputCls} leading-relaxed`}
                  rows={2}
                  value={draft.focusNote ?? ""}
                  onChange={(e) => set("focusNote", e.target.value || null)}
                />
              </label>
            </section>

            {/* notifications */}
            <section className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-calm">
              <header className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-[1.1rem] font-semibold tracking-tight">Notifications</h2>
                  <p className="text-[13px] text-muted-foreground">
                    The rules that decide when LUX pulls this CSM into a customer context.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    set("notifications", [
                      ...draft.notifications,
                      {
                        label: "",
                        channel: "In-app",
                        triggerDetail: null,
                        urgency: "Standard",
                        enabled: true,
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-otto hover:text-otto"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Add rule
                </button>
              </header>

              <Toggle
                label="Proactive notifications"
                caption="LUX may surface an account before the CSM navigates to it."
                checked={draft.proactiveNotifications}
                onChange={(v) => set("proactiveNotifications", v)}
              />
              <Field
                label="Quiet hours"
                value={draft.quietHours ?? ""}
                onChange={(v) => set("quietHours", v || null)}
                placeholder="19:00 – 07:00 PT"
              />

              <div className="space-y-3">
                {draft.notifications.map((rule, i) => (
                  <div key={i} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-start gap-3">
                      <div className="grid flex-1 gap-3 sm:grid-cols-2">
                        <Field
                          label="Rule"
                          value={rule.label}
                          onChange={(v) =>
                            set(
                              "notifications",
                              draft.notifications.map((r, j) =>
                                j === i ? { ...r, label: v } : r,
                              ),
                            )
                          }
                        />
                        <Field
                          label="Channel"
                          value={rule.channel}
                          onChange={(v) =>
                            set(
                              "notifications",
                              draft.notifications.map((r, j) =>
                                j === i ? { ...r, channel: v } : r,
                              ),
                            )
                          }
                        />
                        <Field
                          label="Trigger"
                          value={rule.triggerDetail ?? ""}
                          onChange={(v) =>
                            set(
                              "notifications",
                              draft.notifications.map((r, j) =>
                                j === i ? { ...r, triggerDetail: v || null } : r,
                              ),
                            )
                          }
                        />
                        <Field
                          label="Urgency"
                          value={rule.urgency}
                          onChange={(v) =>
                            set(
                              "notifications",
                              draft.notifications.map((r, j) =>
                                j === i ? { ...r, urgency: v } : r,
                              ),
                            )
                          }
                        />
                        <div className="sm:col-span-2">
                          <Toggle
                            label={rule.enabled ? "Enabled" : "Muted"}
                            caption="Muted rules stay on the record but never surface."
                            checked={rule.enabled}
                            onChange={(v) =>
                              set(
                                "notifications",
                                draft.notifications.map((r, j) =>
                                  j === i ? { ...r, enabled: v } : r,
                                ),
                              )
                            }
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label="Remove rule"
                        onClick={() =>
                          set(
                            "notifications",
                            draft.notifications.filter((_, j) => j !== i),
                          )
                        }
                        className="mt-6 rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* workspace settings */}
            <section className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-calm">
              <header>
                <h2 className="text-[1.1rem] font-semibold tracking-tight">Workspace settings</h2>
                <p className="text-[13px] text-muted-foreground">
                  How the workspace opens: which way of working, and how much of it is Otto.
                </p>
              </header>

              <div className="space-y-1.5">
                <span className="eyebrow">Default way of working</span>
                <div className="flex flex-wrap gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => set("defaultWorkMode", m)}
                      aria-pressed={draft.defaultWorkMode === m}
                      className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors ${
                        draft.defaultWorkMode === m
                          ? "border-otto bg-otto/10 text-otto"
                          : "border-border text-muted-foreground hover:border-otto/50"
                      }`}
                    >
                      {MODE_LABEL[m]}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block space-y-2">
                <span className="eyebrow">
                  Default Otto / canvas split — {draft.defaultSplit}% Otto
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={draft.defaultSplit}
                  onChange={(e) => set("defaultSplit", Number(e.target.value))}
                  className="w-full accent-[var(--otto,#3fae6a)]"
                  aria-label="Default Otto and canvas split"
                />
                <span className="block text-[12px] text-muted-foreground">
                  0% is full adaptive canvas, 100% is full Otto conversation.
                </span>
              </label>

              <Toggle
                label="LUX activity pulse"
                caption="Show the background intelligence rail while agents work."
                checked={draft.activityPulse}
                onChange={(v) => set("activityPulse", v)}
              />
              <Toggle
                label="Demo path panel"
                caption="Keep the presenter footer visible when the experience opens."
                checked={draft.showDemoPath}
                onChange={(v) => set("showDemoPath", v)}
              />
            </section>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={save.isPending}
                onClick={() => {
                  setStatus(null);
                  setError(null);
                  save.mutate(draft);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {save.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="size-4" aria-hidden="true" />
                )}
                Save profile
              </button>
              <span className="text-[12px] text-muted-foreground">
                Saved settings apply the next time the workspace opens.
              </span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
