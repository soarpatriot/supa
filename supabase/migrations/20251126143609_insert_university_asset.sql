-- Insert university asset with topic_id from ''fK�' topic
INSERT INTO assets (type, link, topic_id, created_at, updated_at)
SELECT
  2 AS type,
  'cloud://learn-develop-2gw5rs7l93f9f8bb.6c65-learn-develop-2gw5rs7l93f9f8bb-1327392464/university/university.MP3' AS link,
  t.id AS topic_id,
  NOW() AS created_at,
  NOW() AS updated_at
FROM topics t
WHERE t.name = '大学之路';
