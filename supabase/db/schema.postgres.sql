-- Learning API Database Schema
-- PostgreSQL 12+ compatible
-- Generated from GORM models

-- Drop tables in reverse dependency order if they exist
DROP TABLE IF EXISTS replies CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  open_id VARCHAR(255),
  union_id VARCHAR(255),
  session_key VARCHAR(255),
  name VARCHAR(255),
  phone VARCHAR(255),
  avatar VARCHAR(255),
  created_at TIMESTAMP(3),
  updated_at TIMESTAMP(3)
);

CREATE INDEX idx_users_open_id ON users(open_id);

-- Tokens table
CREATE TABLE tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  access_token TEXT,
  access_token_expires_in INTEGER,
  refresh_token TEXT,
  refresh_token_expires_in INTEGER,
  created_at TIMESTAMP(3),
  updated_at TIMESTAMP(3),
  CONSTRAINT fk_users_tokens FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_tokens_user_id ON tokens(user_id);
CREATE INDEX idx_tokens_access_token ON tokens(access_token);

-- Topics table
CREATE TABLE topics (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  explaination TEXT,
  cover_url VARCHAR(1000),
  created_at TIMESTAMP(3),
  updated_at TIMESTAMP(3)
);

-- Questions table
CREATE TABLE questions (
  id BIGSERIAL PRIMARY KEY,
  content VARCHAR(2000),
  weight INTEGER,
  topic_id BIGINT,
  has_multiple_answers BOOLEAN DEFAULT false,
  created_at TIMESTAMP(3),
  updated_at TIMESTAMP(3),
  CONSTRAINT fk_topics_questions FOREIGN KEY (topic_id)
    REFERENCES topics(id)
);

CREATE INDEX idx_questions_topic_id ON questions(topic_id);

-- Answers table
CREATE TABLE answers (
  id BIGSERIAL PRIMARY KEY,
  content VARCHAR(2000),
  correct BOOLEAN,
  question_id BIGINT,
  created_at TIMESTAMP(3),
  updated_at TIMESTAMP(3),
  CONSTRAINT fk_questions_answers FOREIGN KEY (question_id)
    REFERENCES questions(id)
);

CREATE INDEX idx_answers_question_id ON answers(question_id);

-- Experiences table
CREATE TABLE experiences (
  id BIGSERIAL PRIMARY KEY,
  topic_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP(3),
  updated_at TIMESTAMP(3),
  CONSTRAINT fk_experiences_user FOREIGN KEY (user_id)
    REFERENCES users(id),
  CONSTRAINT fk_experiences_topic FOREIGN KEY (topic_id)
    REFERENCES topics(id)
);

CREATE INDEX idx_experiences_topic_id ON experiences(topic_id);
CREATE INDEX idx_experiences_user_id ON experiences(user_id);

-- Orders table
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  experience_id BIGINT NOT NULL,
  price INTEGER,
  status INTEGER DEFAULT 0,
  order_no VARCHAR(100),
  out_order_no VARCHAR(100),
  created_at TIMESTAMP(3),
  updated_at TIMESTAMP(3),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_orders_experience FOREIGN KEY (experience_id)
    REFERENCES experiences(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX idx_orders_order_no ON orders(order_no);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_experience_id ON orders(experience_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Replies table (junction table between experiences and answers)
CREATE TABLE replies (
  id BIGSERIAL PRIMARY KEY,
  experience_id BIGINT NOT NULL,
  answer_id BIGINT NOT NULL,
  created_at TIMESTAMP(3),
  updated_at TIMESTAMP(3),
  CONSTRAINT fk_experiences_replies FOREIGN KEY (experience_id)
    REFERENCES experiences(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_answers_replies FOREIGN KEY (answer_id)
    REFERENCES answers(id)
);

CREATE INDEX idx_replies_experience_id ON replies(experience_id);
CREATE INDEX idx_replies_answer_id ON replies(answer_id);

-- Order Status Constants (for reference)
-- 0: created
-- 1: pending
-- 2: paid
-- 3: confirmed

-- Optional: Create enum type for order status (alternative to integer)
-- CREATE TYPE order_status AS ENUM ('created', 'pending', 'paid', 'confirmed');
-- Then change the status column to: status order_status DEFAULT 'created'
