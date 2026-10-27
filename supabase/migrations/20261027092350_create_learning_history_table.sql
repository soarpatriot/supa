CREATE TABLE learning_history (
  id BIGSERIAL PRIMARY KEY,

  asset_id BIGINT NOT NULL REFERENCES assets(id),
  user_id VARCHAR(200) NOT NULL,

  position_ms INTEGER NOT NULL DEFAULT 0 CHECK (position_ms >= 0),
  duration_ms INTEGER,
  completed BOOLEAN NOT NULL DEFAULT false,
  last_played_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT learning_history_user_asset_unique UNIQUE (user_id, asset_id)
);

CREATE INDEX learning_history_recent_idx
  ON learning_history (user_id, last_played_at DESC);
