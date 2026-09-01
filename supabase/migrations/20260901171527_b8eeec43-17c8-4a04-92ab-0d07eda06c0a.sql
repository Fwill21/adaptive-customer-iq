CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_name text NOT NULL,
  segment text NOT NULL,
  quarter text NOT NULL,
  outcome text NOT NULL,
  outcome_status text NOT NULL DEFAULT 'Unchanged',
  progress integer NOT NULL DEFAULT 0,
  health_score integer NOT NULL DEFAULT 0,
  sponsor text,
  champion text,
  blocker text,
  next_moment text,
  acv text,
  renewal_window text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.customer_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  label text NOT NULL,
  value text NOT NULL,
  delta text NOT NULL DEFAULT '',
  tone text NOT NULL DEFAULT 'flat',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.customer_adoption_weeks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  week_label text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  actual numeric,
  target numeric,
  projected numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.customer_cases (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  reference text NOT NULL,
  title text NOT NULL,
  severity text NOT NULL DEFAULT 'P2',
  status text NOT NULL DEFAULT 'Open',
  workflow_area text,
  age text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.customer_stakeholders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL,
  lens text,
  engagement text,
  recommendation text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.customer_qbr_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  heading text NOT NULL,
  body text NOT NULL,
  evidence_source text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.customers TO anon, authenticated;
GRANT SELECT ON public.customer_metrics TO anon, authenticated;
GRANT SELECT ON public.customer_adoption_weeks TO anon, authenticated;
GRANT SELECT ON public.customer_cases TO anon, authenticated;
GRANT SELECT ON public.customer_stakeholders TO anon, authenticated;
GRANT SELECT ON public.customer_qbr_sections TO anon, authenticated;
GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.customer_metrics TO service_role;
GRANT ALL ON public.customer_adoption_weeks TO service_role;
GRANT ALL ON public.customer_cases TO service_role;
GRANT ALL ON public.customer_stakeholders TO service_role;
GRANT ALL ON public.customer_qbr_sections TO service_role;

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_adoption_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_qbr_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customer records are publicly readable" ON public.customers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Customer metrics are publicly readable" ON public.customer_metrics FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Customer adoption weeks are publicly readable" ON public.customer_adoption_weeks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Customer cases are publicly readable" ON public.customer_cases FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Customer stakeholders are publicly readable" ON public.customer_stakeholders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Customer QBR sections are publicly readable" ON public.customer_qbr_sections FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.customers (slug, name, short_name, segment, quarter, outcome, outcome_status, progress, health_score, sponsor, champion, blocker, next_moment, acv, renewal_window)
VALUES (
  'northstar-health',
  'Northstar Health',
  'Northstar',
  'Strategic Enterprise · Healthcare',
  'Q3 2026',
  'Reduce clinical service request handling time by 30% across three regional networks.',
  'Unchanged',
  58,
  71,
  'Dr. Renée Okafor, SVP Clinical Operations',
  'Tom Brady-Nwosu, Director of Service Operations',
  'Regional data migration dependency (Wave 2)',
  'Quarterly Business Review',
  '$3.2M',
  '2 quarters'
);

INSERT INTO public.customer_metrics (customer_id, label, value, delta, tone, position)
SELECT c.id, m.label, m.value, m.delta, m.tone, m.position
FROM public.customers c,
(VALUES
  ('Customer Health', '71', '↓ 5 points', 'down', 1),
  ('Service request automation', '49%', '↓ 19%', 'down', 2),
  ('Handling time reduction', '17%', 'Against 30% commitment', 'warn', 3),
  ('Open dependencies', '1', 'Wave 2 migration', 'warn', 4)
) AS m(label, value, delta, tone, position)
WHERE c.slug = 'northstar-health';

INSERT INTO public.customer_adoption_weeks (customer_id, week_label, position, actual, target, projected)
SELECT c.id, w.week_label, w.position, w.actual, w.target, w.projected
FROM public.customers c,
(VALUES
  ('W1', 1, 68, 68, NULL),
  ('W2', 2, 67, 70, NULL),
  ('W3', 3, 66, 72, NULL),
  ('W4', 4, 61, 74, NULL),
  ('W5', 5, 57, 76, NULL),
  ('W6', 6, 53, 78, NULL),
  ('W7', 7, 51, 80, NULL),
  ('W8', 8, 49, 82, 49),
  ('W9', 9, NULL, 84, 46),
  ('W10', 10, NULL, 86, 44)
) AS w(week_label, position, actual, target, projected)
WHERE c.slug = 'northstar-health';

INSERT INTO public.customer_cases (customer_id, reference, title, severity, status, workflow_area, age, position)
SELECT c.id, k.reference, k.title, k.severity, k.status, k.workflow_area, k.age, k.position
FROM public.customers c,
(VALUES
  ('CS-88214', 'Wave 2 environment validation outstanding', 'P1', 'Open', 'Regional migration', 'Open 21 days', 1),
  ('CS-88461', 'Service request routing rules not applied in network 3', 'P2', 'Open', 'Service request automation', 'Open 12 days', 2),
  ('CS-88502', 'Super user enablement blocked pending data migration', 'P2', 'Open', 'Enablement', 'Open 9 days', 3),
  ('CS-87990', 'Duplicate clinical request records on retry', 'P1', 'Resolved', 'Service request automation', 'Resolved in 4 days', 4)
) AS k(reference, title, severity, status, workflow_area, age, position)
WHERE c.slug = 'northstar-health';

INSERT INTO public.customer_stakeholders (customer_id, name, role, lens, engagement, recommendation, position)
SELECT c.id, s.name, s.role, s.lens, s.engagement, s.recommendation, s.position
FROM public.customers c,
(VALUES
  ('Dr. Renée Okafor', 'SVP Clinical Operations · Executive sponsor', 'Executive / outcome', 'Declined last two invitations', 'Get the outcome conversation back in front of the sponsor before the QBR sets the tone.', 1),
  ('Tom Brady-Nwosu', 'Director of Service Operations · Champion', 'Operational', 'Engaged weekly', 'Confirm which regional networks can onboard before Wave 2 completes.', 2),
  ('Priya Raghavan', 'Migration Specialist (ServiceNow)', 'Technical / deployment', 'Active', 'Wave 2 needs environment validation before any new user group onboards.', 3),
  ('Dan Whitfield', 'Adoption Consultant (ServiceNow)', 'Adoption', 'Active', 'Re-run enablement for networks 1 and 2 now; do not wait for Wave 2.', 4),
  ('Sofia Marchetti', 'Account Executive (ServiceNow)', 'Executive / relationship', 'Active', 'Reframe the QBR around the handling-time outcome, not the migration status.', 5)
) AS s(name, role, lens, engagement, recommendation, position)
WHERE c.slug = 'northstar-health';

INSERT INTO public.customer_qbr_sections (customer_id, heading, body, evidence_source, position)
SELECT c.id, q.heading, q.body, q.evidence_source, q.position
FROM public.customers c,
(VALUES
  ('Where the outcome stands', 'Northstar Health has realised a 17% reduction in clinical service request handling time against a 30% Q3 commitment. Networks 1 and 2 carry the entire gain; network 3 has not started.', 'Value model · finance-validated at Q2 QBR', 1),
  ('What changed and why', 'Service request automation usage fell from 68% to 49% over nine weeks. The decline tracks the Wave 2 regional data migration slipping twice, which paused onboarding of the next user group.', 'Adoption telemetry + delivery record', 2),
  ('What we are doing about it', 'Environment validation for Wave 2 has an owner and a two-week path once the customer confirms an infrastructure window. Enablement for networks 1 and 2 is being re-run now rather than waiting.', 'Migration specialist + adoption consultant', 3),
  ('What we need from Northstar', 'An infrastructure validation window in the next two weeks, and confirmation of the network 3 super user group carried over from Q2.', 'Open commitments · success plan', 4)
) AS q(heading, body, evidence_source, position)
WHERE c.slug = 'northstar-health';