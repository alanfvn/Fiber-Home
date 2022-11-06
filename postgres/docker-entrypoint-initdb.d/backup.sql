--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Debian 14.5-1.pgdg110+1)

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

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: auth_user(text, text); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.auth_user(uname text, upass text) RETURNS TABLE(uid integer, username text, fullname text, gid integer, gname text)
    LANGUAGE plpgsql
    AS $$
begin
	return query (
		select user_id, user_name, concat(names, surnames),
		user_group, group_name from tb_users inner join 
		tb_groups on group_id = user_group
		where lower(user_name) = lower(uname) and
		user_password = crypt(upass, user_password)
	);
end; 
$$;


ALTER FUNCTION public.auth_user(uname text, upass text) OWNER TO root;

--
-- Name: create_sell(integer, timestamp with time zone, timestamp with time zone, text, integer, text, text, text, text, text, text, text, timestamp with time zone); Type: PROCEDURE; Schema: public; Owner: root
--

CREATE PROCEDURE public.create_sell(IN seller integer, IN contract_start timestamp with time zone, IN contract_end timestamp with time zone, IN user_n text, IN user_g integer, IN user_pass text, IN user_fname text, IN user_lname text, IN user_phone text, IN user_dpi text, IN user_email text, IN user_address text, IN user_birth timestamp with time zone, OUT cid uuid)
    LANGUAGE plpgsql
    AS $$
declare
-- variable declaration
	uid integer;
begin
	begin
		insert into tb_users(
			user_name, user_group, 
			user_password, 
			names, surnames, 
			phone, dpi, email, 
			address, date_of_birth
		)
		values(
			user_n, user_g, 
      crypt(user_pass, gen_salt('bf', 4)),
			user_fname, user_lname,
			user_phone, user_dpi, 
			user_email, user_address,
			user_birth
		) returning user_id into uid;
		
		--assign the contract uuid
		cid := gen_random_uuid();
		
		insert into tb_sells(
			sell_date,contract_uid,
			seller_id,client_id,
			contract_start_date,contract_end_date
		)
		values (
			now(), cid,
			seller, uid,
			contract_start, contract_end
		);
		
	exception when others then
		raise notice 'error %s', SQLERRM;
		cid := null; 
	end; 
end; $$;


ALTER PROCEDURE public.create_sell(IN seller integer, IN contract_start timestamp with time zone, IN contract_end timestamp with time zone, IN user_n text, IN user_g integer, IN user_pass text, IN user_fname text, IN user_lname text, IN user_phone text, IN user_dpi text, IN user_email text, IN user_address text, IN user_birth timestamp with time zone, OUT cid uuid) OWNER TO root;

--
-- Name: search_staff(text); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.search_staff(search_query text) RETURNS TABLE(uid integer, username text)
    LANGUAGE plpgsql
    AS $$
begin
	return query (
		select user_id, user_name from tb_users where user_group <= 3 
		and user_name ilike concat('%', search_query, '%') limit 10
	);
end; 
$$;


ALTER FUNCTION public.search_staff(search_query text) OWNER TO root;

--
-- Name: upsert_install(integer, integer, timestamp with time zone); Type: PROCEDURE; Schema: public; Owner: root
--

CREATE PROCEDURE public.upsert_install(IN sell_uid integer, IN worker_uid integer, IN date_install timestamp with time zone, OUT log_text text)
    LANGUAGE plpgsql
    AS $$
declare
-- variable declaration
begin
	begin
		
		if exists(select 1 from tb_installations where install_sell = sell_uid) then
			--installation already exists
			update tb_installations set install_date = date_install, install_worker = worker_uid 
			where install_sell = sell_uid;
		else
			--create installation.
			insert into tb_installations(
				install_date, install_sell,
				install_worker
			)
			values (
				date_install, sell_uid,
				worker_uid
			);
		end if;		
		log_text := 'OK';
	exception when others then
		log_text := SQLERRM; 
	end; 
end; $$;


ALTER PROCEDURE public.upsert_install(IN sell_uid integer, IN worker_uid integer, IN date_install timestamp with time zone, OUT log_text text) OWNER TO root;

--
-- Name: upsert_user(text, integer, text, text, text, text, text, text, text, timestamp with time zone); Type: PROCEDURE; Schema: public; Owner: root
--

CREATE PROCEDURE public.upsert_user(IN user_n text, IN user_g integer, IN user_pass text, IN user_fname text, IN user_lname text, IN user_phone text, IN user_dpi text, IN user_email text, IN user_address text, IN user_birth timestamp with time zone, OUT log_data text)
    LANGUAGE plpgsql
    AS $$
declare
-- variable declaration

begin
	--verify pass status
	if coalesce(user_pass, '') <> '' then
		user_pass := crypt(user_pass, gen_salt('bf', 4));
	end if;
	
	begin
		if exists(select 1 from tb_users where lower(user_name) = lower(user_n)) then
			-- user exists update it.
			update tb_users set 
			user_group = user_g,
			user_password = coalesce(user_pass, user_password),
			names = user_fname, surnames = user_lname,
			phone = user_phone, dpi = user_dpi,
			email = user_email, address = user_address,
			date_of_birth = user_birth
			where user_name = user_n;
		else
			-- user doesn't exist create it.
			insert into tb_users(
				user_name, user_group, 
				user_password, 
				names, surnames, 
				phone, dpi, email, 
				address, date_of_birth
			)
			values(
				user_n, user_g, 
				user_pass,
				user_fname, user_lname,
				user_phone, user_dpi, 
				user_email, user_address,
				user_birth
			);
		end if;
		
		log_data := 'OK';
	
	exception when others then
		log_data := SQLERRM; 
	end; 

end; $$;


ALTER PROCEDURE public.upsert_user(IN user_n text, IN user_g integer, IN user_pass text, IN user_fname text, IN user_lname text, IN user_phone text, IN user_dpi text, IN user_email text, IN user_address text, IN user_birth timestamp with time zone, OUT log_data text) OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tb_installations; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.tb_installations (
    install_id integer NOT NULL,
    install_date timestamp with time zone,
    install_sell integer NOT NULL,
    install_worker integer
);


ALTER TABLE public.tb_installations OWNER TO root;

--
-- Name: tb_sells; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.tb_sells (
    sell_id integer NOT NULL,
    sell_date timestamp with time zone,
    contract_uid uuid,
    seller_id integer,
    client_id integer,
    contract_start_date timestamp with time zone,
    contract_end_date timestamp with time zone
);


ALTER TABLE public.tb_sells OWNER TO root;

--
-- Name: tb_users; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.tb_users (
    user_id integer NOT NULL,
    user_name text NOT NULL,
    user_group integer,
    user_password text,
    names text,
    surnames text,
    phone text,
    dpi text NOT NULL,
    email text,
    address text,
    date_of_birth timestamp with time zone
);


ALTER TABLE public.tb_users OWNER TO root;

--
-- Name: installs; Type: VIEW; Schema: public; Owner: root
--

CREATE VIEW public.installs AS
 SELECT tb_installations.install_id,
    tb_installations.install_sell,
    tb_sells.contract_uid,
    tb_installations.install_date,
    client.user_name AS client,
    tb_installations.install_worker,
    worker.user_name AS worker
   FROM (((public.tb_installations
     JOIN public.tb_sells ON ((tb_installations.install_sell = tb_sells.sell_id)))
     JOIN public.tb_users client ON ((tb_sells.client_id = client.user_id)))
     JOIN public.tb_users worker ON ((tb_installations.install_worker = worker.user_id)));


ALTER TABLE public.installs OWNER TO root;

--
-- Name: sells; Type: VIEW; Schema: public; Owner: root
--

CREATE VIEW public.sells AS
 SELECT tb_sells.sell_id,
    tb_sells.seller_id,
    tb_sells.sell_date,
    tb_sells.contract_uid,
    seller.user_name AS seller,
    client.user_name AS client,
    installer.user_name AS installer,
    tb_installations.install_worker
   FROM ((((public.tb_sells
     JOIN public.tb_users seller ON ((tb_sells.seller_id = seller.user_id)))
     JOIN public.tb_users client ON ((tb_sells.client_id = client.user_id)))
     LEFT JOIN public.tb_installations ON ((tb_sells.sell_id = tb_installations.install_sell)))
     LEFT JOIN public.tb_users installer ON ((tb_installations.install_worker = installer.user_id)));


ALTER TABLE public.sells OWNER TO root;

--
-- Name: tb_groups; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.tb_groups (
    group_id integer NOT NULL,
    group_name text NOT NULL
);


ALTER TABLE public.tb_groups OWNER TO root;

--
-- Name: tb_groups_group_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.tb_groups_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tb_groups_group_id_seq OWNER TO root;

--
-- Name: tb_groups_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.tb_groups_group_id_seq OWNED BY public.tb_groups.group_id;


--
-- Name: tb_installations_install_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.tb_installations_install_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tb_installations_install_id_seq OWNER TO root;

--
-- Name: tb_installations_install_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.tb_installations_install_id_seq OWNED BY public.tb_installations.install_id;


--
-- Name: tb_sells_sell_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.tb_sells_sell_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tb_sells_sell_id_seq OWNER TO root;

--
-- Name: tb_sells_sell_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.tb_sells_sell_id_seq OWNED BY public.tb_sells.sell_id;


--
-- Name: tb_users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.tb_users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tb_users_user_id_seq OWNER TO root;

--
-- Name: tb_users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.tb_users_user_id_seq OWNED BY public.tb_users.user_id;


--
-- Name: users; Type: VIEW; Schema: public; Owner: root
--

CREATE VIEW public.users AS
 SELECT tb_users.user_id,
    tb_users.user_name,
    tb_users.user_group,
    tb_users.names,
    tb_users.surnames,
    tb_users.phone,
    tb_users.dpi,
    tb_users.email,
    tb_users.address,
    tb_users.date_of_birth
   FROM public.tb_users;


ALTER TABLE public.users OWNER TO root;

--
-- Name: tb_groups group_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_groups ALTER COLUMN group_id SET DEFAULT nextval('public.tb_groups_group_id_seq'::regclass);


--
-- Name: tb_installations install_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_installations ALTER COLUMN install_id SET DEFAULT nextval('public.tb_installations_install_id_seq'::regclass);


--
-- Name: tb_sells sell_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_sells ALTER COLUMN sell_id SET DEFAULT nextval('public.tb_sells_sell_id_seq'::regclass);


--
-- Name: tb_users user_id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_users ALTER COLUMN user_id SET DEFAULT nextval('public.tb_users_user_id_seq'::regclass);


--
-- Data for Name: tb_groups; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.tb_groups (group_id, group_name) FROM stdin;
1	Admnistrador
2	Supervisor
3	Trabajador
4	Cliente
\.


--
-- Data for Name: tb_installations; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.tb_installations (install_id, install_date, install_sell, install_worker) FROM stdin;
1	\N	2	3
\.


--
-- Data for Name: tb_sells; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.tb_sells (sell_id, sell_date, contract_uid, seller_id, client_id, contract_start_date, contract_end_date) FROM stdin;
1	2022-11-03 06:38:48.409557+00	ad36ab5f-0df6-497c-bc39-f3b593ef9454	1	4	2022-11-03 06:00:00+00	2024-01-01 06:00:00+00
2	2022-11-03 06:44:17.313884+00	401a3b08-8e20-4c49-a53e-defec6aa7efc	1	5	2022-11-03 06:00:00+00	2023-02-02 06:00:00+00
\.


--
-- Data for Name: tb_users; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.tb_users (user_id, user_name, user_group, user_password, names, surnames, phone, dpi, email, address, date_of_birth) FROM stdin;
1	alan	1	$2a$04$ATge0anNpZqGq7Ugk7CmQuyI32/0RhHhfubT6debSPHS2RFHhlZXu	Alan David	González López	49853152	2879007111601	agonzalezl22@miumg.com	1a calle 8-33 zona 4 coban a.v	2000-09-24 06:00:00+00
3	erol	3	$2a$04$WNeAJsV2Eq4iEdvnNGahgOr3XIFCfCGzhZTn2Fm07VvYt2rUvyvkq	Erol Isaias	Chun Morales	49353664	3213123213123	erolm@gmail.com	Purulhá Baja Verapaz	1998-08-15 06:00:00+00
2	manuel	2	$2a$04$pX6UgyBs62lYAdjrZGX2.eOKBRKq1AAUGPv2zaFI3MdOLl2Eb0hne	Manuel	Miguel Miguel	56203045	2879007203003	manuel@gmail.com	9a calle 8-20 Guatemala	1998-07-04 06:00:00+00
4	gerbin	4	\N	Gerbin	Icute	50302020	2987910201203	gerbinicute@gmail.com	Cerca del centro gran Carchá	1999-12-14 06:00:00+00
5	pedro	4	\N	Pedro	Perez	59559102	2897012302130	pedroperez@gmail.com	Guatemala Villa Nueva	1995-06-13 06:00:00+00
\.


--
-- Name: tb_groups_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.tb_groups_group_id_seq', 4, true);


--
-- Name: tb_installations_install_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.tb_installations_install_id_seq', 1, true);


--
-- Name: tb_sells_sell_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.tb_sells_sell_id_seq', 2, true);


--
-- Name: tb_users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.tb_users_user_id_seq', 5, true);


--
-- Name: tb_groups tb_groups_group_name_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_groups
    ADD CONSTRAINT tb_groups_group_name_key UNIQUE (group_name);


--
-- Name: tb_groups tb_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_groups
    ADD CONSTRAINT tb_groups_pkey PRIMARY KEY (group_id);


--
-- Name: tb_installations tb_installations_install_sell_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_installations
    ADD CONSTRAINT tb_installations_install_sell_key UNIQUE (install_sell);


--
-- Name: tb_installations tb_installations_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_installations
    ADD CONSTRAINT tb_installations_pkey PRIMARY KEY (install_id);


--
-- Name: tb_sells tb_sells_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_sells
    ADD CONSTRAINT tb_sells_pkey PRIMARY KEY (sell_id);


--
-- Name: tb_users tb_users_dpi_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_users
    ADD CONSTRAINT tb_users_dpi_key UNIQUE (dpi);


--
-- Name: tb_users tb_users_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_users
    ADD CONSTRAINT tb_users_pkey PRIMARY KEY (user_id);


--
-- Name: tb_users tb_users_user_name_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_users
    ADD CONSTRAINT tb_users_user_name_key UNIQUE (user_name);


--
-- Name: tb_installations fk_installation1; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_installations
    ADD CONSTRAINT fk_installation1 FOREIGN KEY (install_worker) REFERENCES public.tb_users(user_id) ON DELETE CASCADE;


--
-- Name: tb_installations fk_installation2; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_installations
    ADD CONSTRAINT fk_installation2 FOREIGN KEY (install_sell) REFERENCES public.tb_sells(sell_id) ON DELETE CASCADE;


--
-- Name: tb_sells fk_sell1; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_sells
    ADD CONSTRAINT fk_sell1 FOREIGN KEY (seller_id) REFERENCES public.tb_users(user_id) ON DELETE CASCADE;


--
-- Name: tb_sells fk_sell2; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_sells
    ADD CONSTRAINT fk_sell2 FOREIGN KEY (client_id) REFERENCES public.tb_users(user_id) ON DELETE CASCADE;


--
-- Name: tb_users fk_user_group; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.tb_users
    ADD CONSTRAINT fk_user_group FOREIGN KEY (user_group) REFERENCES public.tb_groups(group_id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

