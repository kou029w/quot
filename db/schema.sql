SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    user_id text DEFAULT ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text),
    title text NOT NULL,
    text text NOT NULL,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    published timestamp with time zone
);


--
-- Name: random(public.pages); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.random(public.pages) RETURNS double precision
    LANGUAGE sql
    AS $$
  SELECT random();
$$;


--
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    NEW.updated = CURRENT_TIMESTAMP;
    RETURN NEW;
  END
$$;


--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text DEFAULT ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text) NOT NULL,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: pages pages_title_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_title_key UNIQUE (title);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: pages pages_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER pages_updated BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: users users_updated; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER users_updated BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- Name: pages pages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: pages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

--
-- Name: pages pages_guest_read_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY pages_guest_read_policy ON public.pages TO guest USING ((published <= CURRENT_TIMESTAMP));


--
-- Name: pages pages_write_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY pages_write_policy ON public.pages TO writer USING ((user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text)));


--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: users users_policy; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_policy ON public.users USING ((id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'sub'::text)));


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('0'),
    ('20220907130637');
