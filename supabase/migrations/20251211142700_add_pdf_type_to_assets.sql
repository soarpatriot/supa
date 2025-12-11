-- Add type value 5 for PDF topic structure slides
-- Update CHECK constraint to allow type values 0-5
ALTER TABLE assets DROP CONSTRAINT check_assets_type;

ALTER TABLE assets ADD CONSTRAINT check_assets_type
  CHECK (type >= 0 AND type <= 5);

-- Add comment to document the new type
COMMENT ON COLUMN assets.type IS 'Asset types: 0=picture, 1=video, 2=AI single person audio, 3=AI multiple people audio, 4=real person audio, 5=PDF topic structure slides';
