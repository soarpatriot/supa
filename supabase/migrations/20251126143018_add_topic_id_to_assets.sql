-- Add topic_id column to assets table as foreign key
ALTER TABLE assets
ADD COLUMN topic_id BIGINT REFERENCES topics(id) ON DELETE CASCADE;

-- Create index on topic_id for better query performance
CREATE INDEX idx_assets_topic_id ON assets(topic_id);
