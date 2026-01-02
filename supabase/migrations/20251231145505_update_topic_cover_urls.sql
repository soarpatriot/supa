-- Migration: Update cover URLs for topics
-- Updates cover_url for '大学之路', '穷查理宝典', and '考试脑科学'

DO $$
BEGIN
  -- 1. Update cover_url for '大学之路'
  UPDATE topics
  SET cover_url = 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/university/university-cover.jpeg',
      updated_at = NOW()
  WHERE name = '大学之路';

  -- 2. Update cover_url for '穷查理宝典'
  UPDATE topics
  SET cover_url = 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/charlie/charli-cover.jpeg',
      updated_at = NOW()
  WHERE name = '穷查理宝典';

  -- 3. Update cover_url for '考试脑科学'
  UPDATE topics
  SET cover_url = 'cloud://learn-production-1fyzsv3105009f4.6c65-learn-production-1fyzsv3105009f4-1327392464/brain/exam-cover.jpeg',
      updated_at = NOW()
  WHERE name = '考试脑科学';

END $$;
