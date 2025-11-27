-- Create categories table
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255)
);

-- Insert initial category records
INSERT INTO categories (name) VALUES
  ('教育成长'),
  ('科学方法'),
  ('个人成长'),
  ('心理学');
