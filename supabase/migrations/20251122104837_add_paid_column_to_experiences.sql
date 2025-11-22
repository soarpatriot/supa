-- Add paid column to experiences table
ALTER TABLE experiences
ADD COLUMN paid BOOLEAN DEFAULT false;
