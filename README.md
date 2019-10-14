create database todoapp;

create user lion;
alter user lion with superuser;

create table users(
id serial primary key,
name char(20),
email char(30) not null,
password text);

create table todos(
id serial primary key,
user_id integer references users (id),
value text not null,
is_checked boolean default false
);

insert into users (name, email, password) values ('tasha', 'med@kakao.love', 1);
insert into todos (user_id, value, is_checked) values (1, 'and somth', false);
insert into users (name, email, password) values ('rina', 'e@m.a', 3);
insert into todos (user_id, value, is_checked) values (3, 'WOHOOOOOO', false);


alter database todoapp  owner to lion;
alter user lion with password 'lionize';