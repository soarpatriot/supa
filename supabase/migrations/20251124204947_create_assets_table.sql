-- Create assets table
CREATE TABLE assets (
  id BIGSERIAL PRIMARY KEY,
  type INTEGER NOT NULL,
  link VARCHAR(1000),
  created_at TIMESTAMP(3),
  updated_at TIMESTAMP(3)
);

-- Add CHECK constraint for type values
-- 0: picture
-- 1: video
-- 2: AI single person audio
-- 3: AI multiple people audio
-- 4: real person audio
ALTER TABLE assets ADD CONSTRAINT check_assets_type
  CHECK (type >= 0 AND type <= 4);

-- Create index on type for better query performance
CREATE INDEX idx_assets_type ON assets(type);
