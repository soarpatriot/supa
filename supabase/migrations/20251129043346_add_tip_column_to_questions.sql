-- Add tip column to questions table
ALTER TABLE questions
ADD COLUMN tip VARCHAR(1000);
