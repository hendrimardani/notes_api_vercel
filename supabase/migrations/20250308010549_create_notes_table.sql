CREATE TABLE notes(
  id VARCHAR(50) PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);