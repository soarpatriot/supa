-- Migration: Insert additional assets for topics
-- Adds images and PDF assets to existing topics

DO $$
BEGIN
  -- 1. Add brain-info.png (type 0: picture) to '考试脑科学'
  INSERT INTO assets (type, link, topic_id, created_at, updated_at)
  VALUES (
    0,
    'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/brain/brain-info.png',
    (SELECT id FROM topics WHERE name = '考试脑科学' LIMIT 1),
    NOW(),
    NOW()
  );

  -- 2. Add charli-core.png (type 0: picture) to '穷查理宝典'
  INSERT INTO assets (type, link, topic_id, created_at, updated_at)
  VALUES (
    0,
    'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/charlie/charli-core.png',
    (SELECT id FROM topics WHERE name = '穷查理宝典' LIMIT 1),
    NOW(),
    NOW()
  );

  -- 3. Add Munger_Mind_System.pdf (type 5: PDF topic structure slides) to '穷查理宝典'
  INSERT INTO assets (type, link, topic_id, created_at, updated_at)
  VALUES (
    5,
    'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/charlie/Munger_Mind_System.pdf',
    (SELECT id FROM topics WHERE name = '穷查理宝典' LIMIT 1),
    NOW(),
    NOW()
  );

  -- 4. Add university.png (type 0: picture) to '大学之路'
  INSERT INTO assets (type, link, topic_id, created_at, updated_at)
  VALUES (
    0,
    'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/university/university.png',
    (SELECT id FROM topics WHERE name = '大学之路' LIMIT 1),
    NOW(),
    NOW()
  );

END $$;
