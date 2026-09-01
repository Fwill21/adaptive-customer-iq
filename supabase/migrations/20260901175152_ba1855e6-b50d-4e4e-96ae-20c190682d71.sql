CREATE TABLE public.csm_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  role_title text NOT NULL DEFAULT 'Customer Success Manager',
  email text,
  avatar_initials text NOT NULL DEFAULT 'MA',
  avatar_tone text NOT NULL DEFAULT 'green',
  timezone text NOT NULL DEFAULT 'America/Los_Angeles',
  focus_note text,
  default_work_mode text NOT NULL DEFAULT 'hybrid',
  default_split integer NOT NULL DEFAULT 50,
  activity_pulse boolean NOT NULL DEFAULT true,
  show_demo_path boolean NOT NULL DEFAULT true,
  proactive_notifications boolean NOT NULL DEFAULT true,
  quiet_hours text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.csm_profiles TO anon;
GRANT SELECT ON public.csm_profiles TO authenticated;
GRANT ALL ON public.csm_profiles TO service_role;

ALTER TABLE public.csm_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CSM profiles are publicly readable"
  ON public.csm_profiles FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.csm_notification_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.csm_profiles(id) ON DELETE CASCADE,
  label text NOT NULL,
  channel text NOT NULL DEFAULT 'In-app',
  trigger_detail text,
  urgency text NOT NULL DEFAULT 'Standard',
  enabled boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.csm_notification_rules TO anon;
GRANT SELECT ON public.csm_notification_rules TO authenticated;
GRANT ALL ON public.csm_notification_rules TO service_role;

ALTER TABLE public.csm_notification_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CSM notification rules are publicly readable"
  ON public.csm_notification_rules FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_csm_profiles_updated_at
  BEFORE UPDATE ON public.csm_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.csm_profiles (
  slug, name, role_title, email, avatar_initials, avatar_tone, timezone, focus_note,
  default_work_mode, default_split, activity_pulse, show_demo_path, proactive_notifications, quiet_hours
) VALUES (
  'maya-alvarez', 'Maya Alvarez', 'Customer Success Manager', 'maya.alvarez@example.com',
  'MA', 'green', 'America/Los_Angeles',
  'Northstar Health renewal quarter — automation adoption is the outcome I own.',
  'hybrid', 50, true, true, true, '19:00 – 07:00 PT'
);

INSERT INTO public.csm_notification_rules (profile_id, label, channel, trigger_detail, urgency, enabled, position)
SELECT p.id, v.label, v.channel, v.trigger_detail, v.urgency, v.enabled, v.position
FROM public.csm_profiles p,
(VALUES
  ('Adoption divergence on an owned account', 'In-app + Slack', 'Weekly usage falls more than 4 points below target', 'Surface immediately', true, 0),
  ('New P1 case on a renewal-quarter account', 'In-app + Slack', 'Severity P1 opened on an account inside its renewal window', 'Surface immediately', true, 1),
  ('Stakeholder engagement drop', 'In-app', 'Sponsor or champion goes quiet for two weeks', 'Daily digest', true, 2),
  ('QBR readiness reaches complete', 'In-app', 'Review narrative and evidence are prepared by LUX', 'Daily digest', true, 3),
  ('Expansion signal from AE context', 'Email', 'AE logs pipeline movement on an owned account', 'Weekly summary', false, 4)
) AS v(label, channel, trigger_detail, urgency, enabled, position)
WHERE p.slug = 'maya-alvarez';