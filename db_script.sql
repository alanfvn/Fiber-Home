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
  installation_id serial primary key not null,
  installation_done boolean,
  installation_date timestamptz,
  sell_id int,
  assigned_worker int,

  constraint fk_installation1 foreign key(assigned_worker)
  references tb_users(user_id) on delete cascade
);

-- tabla de equipos
create table tb_teams(
  team_id serial primary key not null,
  team_name text unique,
  team_leader int,

  constraint fk_team_leader foreign key(team_leader)
  references tb_users(user_id) on delete cascade
);

-- tabla de miembros de equipos
create table tb_team_members(
  team_member_id serial primary key not null,
  team_id int,
  team_member int, 

  constraint fk_member1 foreign key(team_id) 
  references tb_teams(team_id) on delete cascade,

  constraint fk_members2 foreign key(team_member)
  references tb_users(user_id) on delete cascade
);