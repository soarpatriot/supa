-- Migration: Update author for '穷查理宝典'
-- Changes author to '彼得·考夫曼'

DO $$
BEGIN
  -- Update author for '穷查理宝典'
  UPDATE topics
  SET author = '彼得·考夫曼',
      updated_at = NOW()
  WHERE name = '穷查理宝典';

END $$;
