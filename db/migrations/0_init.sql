-- migrate:up
CREATE FUNCTION update_timestamp() RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    NEW.updated = CURRENT_TIMESTAMP;
    RETURN NEW;
  END
$$;

CREATE TABLE pages (
  id      SERIAL PRIMARY KEY,
  title   TEXT NOT NULL UNIQUE,
  text    TEXT NOT NULL,
  created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER pages_updated BEFORE UPDATE ON pages FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();

-- migrate:down
DROP TRIGGER pages_updated ON pages;
DROP TABLE pages;
DROP FUNCTION update_timestamp();
