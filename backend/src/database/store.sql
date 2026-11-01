create database if not exists store
character set utf8mb4
collate utf8mb4_unicode_ci;
use store;

create table if not exists categorys(
	idCategory int primary key auto_increment,
    name varchar(100) not null
);

create table if not exists products(
    codProduct int primary key unique,
    name varchar(100) not null,
    mark varchar(50) not null,
    price decimal(10,2) not null,
    idCategory int not null,
    foreign key (idCategory) references categorys (idCategory)
);

create table if not exists lots(
    codLot char(8) primary key unique,
    codProduct int not null,
    quantity int not null,
    expirationDate date not null,
    foreign key (codProduct) references products(codProduct)
);

create table if not exists sales(
    idSale int auto_increment primary key,
    date timestamp default current_timestamp,
    totalValue decimal(10,2) not null
);

create table if not exists item_sale(
    idItem int auto_increment primary key,
    idSale int not null,
    codProduct int not null,
    quantity int not null,
    price decimal(10,2) not null,
    foreign key (idSale) references sales(idSale),
    foreign key (codProduct) references products(codProduct)
);

create table if not exists users(
    idUser int auto_increment primary key,
    name varchar(150) not null,
    username varchar(60) not null unique,
    cpf char(11) not null unique,
    email varchar(150) not null unique,
    telephone varchar(20) not null unique,
    password varchar(150) not null
);

INSERT INTO categorys (name) VALUES
('Alimentos'),
('Bebidas'),
('Laticínios'),
('Frios'),
('Carnes'),
('Hortifruti'),
('Padaria'),
('Doces e Sobremesas'),
('Biscoitos e Snacks'),
('Massas e Grãos'),
('Enlatados e Conservas'),
('Molhos e Temperos'),
('Café e Chá'),
('Produtos de Limpeza'),
('Higiene Pessoal'),
('Higiene Infantil'),
('Produtos para Animais'),
('Congelados'),
('Utilidades Domésticas'),
('Outros');
