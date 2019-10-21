This is backend for todoapp on node.js with sequelize and postgresql database. Run this first if you want the app work correct.
1. git clone https://github.com/side-of-raya/todo-backend
2. npm install
3. nodemon app.js

You also need to create your own .env file, you can even rename .example.env to .env and use it (UNSAFE).
Database creation script written below


create database todo;

create user okroshka;
alter user okroshka with superuser;

\c todo

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

alter database todo  owner to okroshka;
alter user okroshka with password 'kek';
