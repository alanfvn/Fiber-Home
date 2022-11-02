-- tabla de los grupos
create table tb_groups(
    group_id serial primary key not null,
    group_name text unique not null
);

-- tabla de los usuarios
create table tb_users(
  user_id serial primary key not null,
  user_name text unique not null, 
  user_group int,
  user_password text,
  names text,
  surnames text,
  phone text, 
  dpi text unique not null,
  email text, 
  address text,
  date_of_birth timestamptz, 
  
  constraint fk_user_group foreign key(user_group)
  references tb_groups(group_id) on delete set null 
);

-- tabla de ventas
create table tb_sells(
  sell_id serial primary key not null,
  sell_date timestamptz,
  contract_uid uuid,
  seller_id int,
  client_id int,
  contract_start_date timestamptz, 
  contract_end_date timestamptz,

  constraint fk_sell1 foreign key(seller_id)
  references tb_users(user_id) on delete cascade,

  constraint fk_sell2 foreign key(client_id) 
  references tb_users(user_id) on delete cascade
);

-- tabla de instalaciones
create table tb_installations(
  install_id serial primary key not null,
  install_date timestamptz,
  install_sell int unique not null,
  install_worker int,

  constraint fk_installation1 foreign key(install_worker)
  references tb_users(user_id) on delete cascade
);

--procedimientos
-- CREAR USUARIO
create procedure upsert_user(
	user_n text,
	user_g int,user_pass text,
	user_fname text,user_lname text,
	user_phone text,user_dpi text,
	user_email text,user_address text,
	user_birth timestamptz,
	out log_data text
)
language plpgsql
as $$
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

end; $$

-- CREAR VENTA
create procedure create_sell(
	--seller data
	seller int,
	contract_start timestamptz,
	contract_end timestamptz,
	--new client data
	user_n text, user_g int, user_pass text,
	user_fname text, user_lname text,
	user_phone text, user_dpi text,
	user_email text, user_address text,
	user_birth timestamptz,
	--generated uuid for the contract
	out cid uuid
)
language plpgsql
as $$
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
end; $$

-- CREAR INSTALACION
create procedure upsert_install(
	sell_uid int,
	worker_uid int,
	date_install timestamptz,
	--log
	out log_text text
)
language plpgsql
as $$
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
end; $$


--functions
create function auth_user(uname text, upass text)
returns table(
	uid int,
	username text,
	fullname text,
	gid int,
	gname text
)
as $$
begin
	return query (
		select user_id, user_name, concat(names, surnames),
		user_group, group_name from tb_users inner join 
		tb_groups on group_id = user_group
		where lower(user_name) = lower(uname) and
		user_password = crypt(upass, user_password)
	);
end; 
$$ language plpgsql


--vistas
create view users as
(
	select user_id, user_name, user_group,
	names, surnames, phone, dpi, email, address,
	date_of_birth from tb_users
);

create view sells as 
(
  select tb_sells.sell_id, tb_sells.seller_id, 
  tb_sells.sell_date, tb_sells.contract_uid, 
  seller.user_name as seller, 
  client.user_name as client,
  tb_installations.install_worker
  from tb_sells 
  inner join tb_users as seller on tb_sells.seller_id = seller.user_id
  inner join tb_users as client on tb_sells.client_id = client.user_id
  left join tb_installations on tb_sells.sell_id = tb_installations.install_sell
);


-- PRUEBAS
DO
$$
DECLARE log_d text;
BEGIN
    CALL upsert_user(
      'alan', 2, 'alan123', 
      'Alan David', 'Gonzalez Lopez', '20204040', 
      '28790000101', 'alan@gmail.com', 
      '1a calle coban a.v', '2000-09-24', log_d);
    RAISE NOTICE 'resp: %', log_d;
END
$$
