-- migrate:up
CREATE FUNCTION random(pages) RETURNS DOUBLE PRECISION LANGUAGE SQL AS $$
  SELECT random();
$$;

-- migrate:down
DROP FUNCTION random(pages);
