-- Create consultation_requests table to track users who paid $100
CREATE TABLE IF NOT EXISTS consultation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'negotiating', 'completed', 'declined')),
  admin_notes TEXT,
  user_email TEXT NOT NULL,
  payment_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pesapal', 'bitcoin')),
  contacted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_consultation_requests_user_id ON consultation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_status ON consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_created_at ON consultation_requests(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_consultation_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER consultation_requests_updated_at
  BEFORE UPDATE ON consultation_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_consultation_requests_updated_at();

-- Enable RLS
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own consultation requests
CREATE POLICY "Users can view own consultation requests"
  ON consultation_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own consultation requests (via API)
CREATE POLICY "Users can create own consultation requests"
  ON consultation_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Service role can do everything (for admin operations)
CREATE POLICY "Service role has full access"
  ON consultation_requests
  FOR ALL
  USING (auth.role() = 'service_role');
