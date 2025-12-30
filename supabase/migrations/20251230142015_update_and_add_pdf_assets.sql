-- Migration: Update and add PDF assets for topics
-- 1. Update '穷查理宝典' PDF asset from Munger_Mind_System.pdf to charli.pdf
-- 2. Add university.pdf to '大学之路'
-- 3. Add exam-info.pdf to '考试脑科学'

DO $$
BEGIN
  -- 1. Update existing PDF asset for '穷查理宝典'
  -- Change Munger_Mind_System.pdf to charli.pdf
  UPDATE assets
  SET link = 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/charlie/charli.pdf',
      updated_at = NOW()
  WHERE link = 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/charlie/Munger_Mind_System.pdf'
    AND topic_id = (SELECT id FROM topics WHERE name = '穷查理宝典' LIMIT 1);

  -- 2. Add university.pdf (type 5: PDF) to '大学之路'
  INSERT INTO assets (type, link, topic_id, created_at, updated_at)
  VALUES (
    5,
    'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/university/university.pdf',
    (SELECT id FROM topics WHERE name = '大学之路' LIMIT 1),
    NOW(),
    NOW()
  );

  -- 3. Add exam-info.pdf (type 5: PDF) to '考试脑科学'
  INSERT INTO assets (type, link, topic_id, created_at, updated_at)
  VALUES (
    5,
    'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/brain/exam-info.pdf',
    (SELECT id FROM topics WHERE name = '考试脑科学' LIMIT 1),
    NOW(),
    NOW()
  );

END $$;
