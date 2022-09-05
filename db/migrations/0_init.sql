-- migrate:up
CREATE ROLE guest;
ALTER ROLE guest SET statement_timeout = '1s';
CREATE ROLE writer;
ALTER ROLE writer SET statement_timeout = '1s';

CREATE FUNCTION update_timestamp() RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    NEW.updated = CURRENT_TIMESTAMP;
    RETURN NEW;
  END
$$;

CREATE TABLE users (
  id      TEXT PRIMARY KEY DEFAULT current_setting('request.jwt.claims', true)::json ->> 'sub'::text,
  created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER users_updated BEFORE UPDATE ON users FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();

GRANT ALL (id) ON users TO writer;
GRANT SELECT, DELETE ON users TO writer;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_policy ON users USING (
  id = current_setting('request.jwt.claims', true)::json ->> 'sub'::text
);

CREATE TABLE pages (
  id        SERIAL PRIMARY KEY,
  user_id   TEXT REFERENCES users ON DELETE CASCADE DEFAULT current_setting('request.jwt.claims', true)::json ->> 'sub'::text,
  title     TEXT NOT NULL UNIQUE,
  text      TEXT NOT NULL,
  created   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published TIMESTAMPTZ
);

CREATE TRIGGER pages_updated BEFORE UPDATE ON pages FOR EACH ROW
  EXECUTE PROCEDURE update_timestamp();

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON pages TO guest;
CREATE POLICY pages_guest_read_policy ON pages TO guest USING (
  published <= CURRENT_TIMESTAMP
);

GRANT SELECT, DELETE ON pages TO writer;
GRANT ALL (id, title, text, published) ON pages TO writer;
GRANT ALL ON SEQUENCE pages_id_seq TO writer;
CREATE POLICY pages_write_policy ON pages TO writer USING (
  user_id = current_setting('request.jwt.claims', true)::json ->> 'sub'::text
);

-- migrate:down
DROP TABLE users;
DROP TABLE pages;
DROP FUNCTION update_timestamp();
DROP ROLE guest;
DROP ROLE writer;
