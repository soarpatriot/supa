-- Insert brain science assets with topic_id from '��f' topic
INSERT INTO assets (type, link, topic_id, created_at, updated_at)
SELECT
  type,
  link,
  t.id AS topic_id,
  NOW() AS created_at,
  NOW() AS updated_at
FROM topics t
CROSS JOIN (
  VALUES
    (2, 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/brain/questions.wav'),
    (4, 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/brain/brain.MP3'),
    (3, 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/brain/books-brain-learning.wav')
) AS asset_data(type, link)
WHERE t.name = '考试脑科学';
