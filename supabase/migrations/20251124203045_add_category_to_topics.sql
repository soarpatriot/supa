-- Add category_id column to topics table
ALTER TABLE topics ADD COLUMN category_id BIGINT;

-- Add foreign key constraint
ALTER TABLE topics ADD CONSTRAINT fk_topics_category
  FOREIGN KEY (category_id) REFERENCES categories(id);

-- Create index on category_id
CREATE INDEX idx_topics_category_id ON topics(category_id);

-- Update topics with their categories
UPDATE topics SET category_id = (SELECT id FROM categories WHERE name = '教育成长')
  WHERE name = '大学之路';

UPDATE topics SET category_id = (SELECT id FROM categories WHERE name = '科学方法')
  WHERE name = '考试脑科学';
