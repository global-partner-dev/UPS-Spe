CREATE TABLE public.quote_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_hash text NOT NULL CHECK (char_length(requester_hash) = 64),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.quote_rate_limits TO service_role;
ALTER TABLE public.quote_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE INDEX quote_rate_limits_lookup_idx ON public.quote_rate_limits (requester_hash, created_at DESC);