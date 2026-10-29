-- Supabase SQL Editor: run before accepting real leads. Keep service-role key on the server.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS public.kz_leads (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 submission_id uuid NOT NULL UNIQUE,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 kind text NOT NULL CHECK (kind IN ('seller','buyer','general')),
 type text NOT NULL,
 property_code text,
 source_path text NOT NULL DEFAULT '/',
 landing_path text,
 utm_source text,
 encrypted_payload text NOT NULL CHECK (encrypted_payload LIKE 'enc:v1:%'),
 consent_at timestamptz NOT NULL DEFAULT now(),
 status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','consultation_scheduled','mandate_signed','closed','spam')),
 notification_status text NOT NULL DEFAULT 'pending' CHECK (notification_status IN ('pending','sent','failed')),
 receipt_status text NOT NULL DEFAULT 'pending' CHECK (receipt_status IN ('pending','sent','failed')),
 owner_notified_at timestamptz,
 qualified_at timestamptz,
 mandate_signed_at timestamptz
);
CREATE INDEX IF NOT EXISTS kz_leads_created_at_idx ON public.kz_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS kz_leads_status_idx ON public.kz_leads (status, created_at DESC);
ALTER TABLE public.kz_leads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.kz_leads FROM anon, authenticated;
-- NO anon/authenticated policies: only the trusted server uses service_role.
COMMENT ON TABLE public.kz_leads IS 'Kiss Zoltan: AES-256-GCM-encrypted lead PII, server-only access. Retention requires an approved privacy policy.';
