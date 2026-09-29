CREATE TYPE public.app_role AS ENUM ('admin', 'editor');
CREATE TYPE public.quote_status AS ENUM ('new', 'contacted', 'qualified', 'closed');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 100),
  summary text NOT NULL CHECK (char_length(summary) BETWEEN 10 AND 300),
  details text NOT NULL DEFAULT '' CHECK (char_length(details) <= 3000),
  icon text NOT NULL DEFAULT 'zap' CHECK (icon IN ('zap','wrench','battery','shield','activity','settings')),
  display_order integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published services are public" ON public.services FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can view all services" ON public.services FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create services" ON public.services FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 120),
  summary text NOT NULL CHECK (char_length(summary) BETWEEN 10 AND 400),
  category text NOT NULL CHECK (char_length(category) BETWEEN 2 AND 80),
  location text NOT NULL DEFAULT '' CHECK (char_length(location) <= 120),
  result text NOT NULL DEFAULT '' CHECK (char_length(result) <= 300),
  image_url text NOT NULL DEFAULT '' CHECK (char_length(image_url) <= 1000),
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published projects are public" ON public.projects FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can view all projects" ON public.projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can create projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  company_name text NOT NULL DEFAULT 'UPS Spe' CHECK (char_length(company_name) BETWEEN 2 AND 100),
  email text NOT NULL DEFAULT '' CHECK (char_length(email) <= 255),
  phone text NOT NULL DEFAULT '' CHECK (char_length(phone) <= 40),
  location text NOT NULL DEFAULT '' CHECK (char_length(location) <= 160),
  availability text NOT NULL DEFAULT 'Available for planned projects and urgent support.' CHECK (char_length(availability) <= 240),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings are public" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  phone text NOT NULL DEFAULT '' CHECK (char_length(phone) <= 40),
  company text NOT NULL DEFAULT '' CHECK (char_length(company) <= 120),
  service text NOT NULL CHECK (char_length(service) BETWEEN 2 AND 100),
  equipment text NOT NULL DEFAULT '' CHECK (char_length(equipment) <= 300),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 2000),
  consent boolean NOT NULL CHECK (consent = true),
  status public.quote_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.quote_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can request a quote" ON public.quote_requests FOR INSERT TO anon, authenticated WITH CHECK (consent = true AND status = 'new');
CREATE POLICY "Admins can view quote requests" ON public.quote_requests FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update quote requests" ON public.quote_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete quote requests" ON public.quote_requests FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER quotes_updated_at BEFORE UPDATE ON public.quote_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (id) VALUES (true);
INSERT INTO public.services (slug, title, summary, details, icon, display_order, published) VALUES
('ups-installation', 'UPS Installation', 'Right-sized installation and commissioning for reliable power from day one.', 'Site review, load assessment, equipment positioning, electrical integration, configuration, testing, and handover.', 'zap', 1, true),
('preventive-maintenance', 'Preventive Maintenance', 'Planned inspections that identify battery, cooling, and component risks before downtime.', 'Routine inspection, cleaning, health checks, alarm review, performance testing, and clear maintenance reporting.', 'activity', 2, true),
('repair-troubleshooting', 'Repair & Troubleshooting', 'Structured fault diagnosis and practical repair support for UPS equipment.', 'Fault isolation, alarm investigation, component assessment, corrective recommendations, and return-to-service testing.', 'wrench', 3, true),
('battery-services', 'Battery Services', 'Battery health assessment and replacement planning for dependable runtime.', 'Condition checks, safe replacement, connection inspection, runtime considerations, and responsible handling guidance.', 'battery', 4, true),
('power-consulting', 'Power Protection Consulting', 'Clear recommendations for capacity, redundancy, resilience, and future growth.', 'Requirements discovery, load and risk review, topology guidance, lifecycle planning, and solution recommendations.', 'shield', 5, true),
('configuration-testing', 'Configuration & Testing', 'Controlled setup and verification to ensure the system behaves as intended.', 'Operating parameter review, bypass checks, alarm validation, functional testing, and documented handover.', 'settings', 6, true);

INSERT INTO public.projects (slug, title, summary, category, location, result, featured, published) VALUES
('critical-load-power-refresh', 'Critical Load Power Refresh', 'A structured UPS modernization concept for a business-critical equipment room, from load review through commissioning.', 'UPS modernization', 'Location available on request', 'Improved resilience and a clearer maintenance path.', true, true),
('battery-lifecycle-program', 'Battery Lifecycle Program', 'A preventive battery inspection and staged replacement program designed to reduce avoidable runtime risk.', 'Preventive maintenance', 'Location available on request', 'Better visibility into battery condition and replacement priorities.', true, true),
('backup-power-assessment', 'Backup Power Assessment', 'A power-protection review mapping critical loads, current risks, and practical next-step recommendations.', 'Consulting', 'Location available on request', 'A prioritized roadmap for a more resilient power environment.', true, true);