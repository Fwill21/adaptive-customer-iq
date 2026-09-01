/* The CSM behind the workspace — Maya's identity, notification rules and
 * workspace settings — stored as records instead of hard-coded strings.
 *
 * Reads are public (read-only leadership experience) through a server-side
 * publishable client; writes run with the privileged client so the tables stay
 * read-only through the Data API. */

import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export const DEFAULT_CSM_SLUG = "maya-alvarez";

export type NotificationRule = {
  label: string;
  channel: string;
  triggerDetail: string | null;
  urgency: string;
  enabled: boolean;
};

export type CsmProfile = {
  slug: string;
  name: string;
  roleTitle: string;
  email: string | null;
  avatarInitials: string;
  avatarTone: string;
  timezone: string;
  focusNote: string | null;
  defaultWorkMode: string;
  defaultSplit: number;
  activityPulse: boolean;
  showDemoPath: boolean;
  proactiveNotifications: boolean;
  quietHours: string | null;
  notifications: NotificationRule[];
};

function serverClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const SlugInput = z.object({ slug: z.string().min(1).default(DEFAULT_CSM_SLUG) });

export const getCsmProfile = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => SlugInput.parse(data ?? {}))
  .handler(async ({ data }): Promise<CsmProfile | null> => {
    const supabase = serverClient();

    const { data: profile, error } = await supabase
      .from("csm_profiles")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!profile) return null;

    const { data: rules, error: rulesError } = await supabase
      .from("csm_notification_rules")
      .select("label,channel,trigger_detail,urgency,enabled,position")
      .eq("profile_id", profile.id)
      .order("position");
    if (rulesError) throw new Error(rulesError.message);

    return {
      slug: profile.slug,
      name: profile.name,
      roleTitle: profile.role_title,
      email: profile.email,
      avatarInitials: profile.avatar_initials,
      avatarTone: profile.avatar_tone,
      timezone: profile.timezone,
      focusNote: profile.focus_note,
      defaultWorkMode: profile.default_work_mode,
      defaultSplit: profile.default_split,
      activityPulse: profile.activity_pulse,
      showDemoPath: profile.show_demo_path,
      proactiveNotifications: profile.proactive_notifications,
      quietHours: profile.quiet_hours,
      notifications: (rules ?? []).map((r) => ({
        label: r.label,
        channel: r.channel,
        triggerDetail: r.trigger_detail,
        urgency: r.urgency,
        enabled: r.enabled,
      })),
    };
  });

const RuleSchema = z.object({
  label: z.string().min(1),
  channel: z.string().min(1).default("In-app"),
  triggerDetail: z.string().nullable().default(null),
  urgency: z.string().min(1).default("Standard"),
  enabled: z.boolean().default(true),
});

const ProfileSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only."),
  name: z.string().min(1),
  roleTitle: z.string().min(1),
  email: z.string().nullable().default(null),
  avatarInitials: z.string().min(1).max(3),
  avatarTone: z.string().min(1),
  timezone: z.string().min(1),
  focusNote: z.string().nullable().default(null),
  defaultWorkMode: z.string().min(1),
  defaultSplit: z.number().int().min(0).max(100),
  activityPulse: z.boolean(),
  showDemoPath: z.boolean(),
  proactiveNotifications: z.boolean(),
  quietHours: z.string().nullable().default(null),
  notifications: z.array(RuleSchema).default([]),
});

export type EditableCsmProfile = z.infer<typeof ProfileSchema>;

export const saveCsmProfile = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ProfileSchema.parse(data))
  .handler(async ({ data }): Promise<{ slug: string }> => {
    const supabase = await admin();

    const row = {
      slug: data.slug,
      name: data.name,
      role_title: data.roleTitle,
      email: data.email,
      avatar_initials: data.avatarInitials,
      avatar_tone: data.avatarTone,
      timezone: data.timezone,
      focus_note: data.focusNote,
      default_work_mode: data.defaultWorkMode,
      default_split: data.defaultSplit,
      activity_pulse: data.activityPulse,
      show_demo_path: data.showDemoPath,
      proactive_notifications: data.proactiveNotifications,
      quiet_hours: data.quietHours,
    };

    const { data: saved, error } = await supabase
      .from("csm_profiles")
      .upsert(row, { onConflict: "slug" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    await supabase.from("csm_notification_rules").delete().eq("profile_id", saved.id);

    if (data.notifications.length) {
      const { error: insertError } = await supabase.from("csm_notification_rules").insert(
        data.notifications.map((n, i) => ({
          profile_id: saved.id,
          label: n.label,
          channel: n.channel,
          trigger_detail: n.triggerDetail,
          urgency: n.urgency,
          enabled: n.enabled,
          position: i,
        })),
      );
      if (insertError) throw new Error(insertError.message);
    }

    return { slug: data.slug };
  });
