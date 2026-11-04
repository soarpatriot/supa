-- Learning history: one record per topic (was one per audio asset).
--
-- Wipes existing checkpoints, adds a topic_id column, and moves the
-- uniqueness key from (user_id, asset_id) to (user_id, topic_id) so
-- re-listening to any audio of a topic updates the single row for that topic.
--
-- Safe to run once. The DELETE makes the backfill of topic_id unnecessary.

-- 1. Clear all existing per-asset history (explicitly requested).
delete from learning_history;

-- 2. Add the topic reference used as the new uniqueness key.
alter table learning_history
  add column if not exists topic_id bigint references topics(id);

-- 3. Swap the uniqueness constraint: one row per (user, topic).
alter table learning_history
  drop constraint if exists learning_history_user_asset_unique;

alter table learning_history
  add constraint learning_history_user_topic_unique unique (user_id, topic_id);

-- 4. topic_id is required going forward (every save derives it from the asset).
alter table learning_history
  alter column topic_id set not null;

-- asset_id is kept (records which audio to resume) but is no longer in the key.
