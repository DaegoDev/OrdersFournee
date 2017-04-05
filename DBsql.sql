-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2017-04-05 05:18:00.432

-- tables
-- Table: address
CREATE TABLE address (
    id int NOT NULL AUTO_INCREMENT,
    country varchar(64) NOT NULL,
    department varchar(64) NOT NULL,
    city varchar(64) NOT NULL,
    neighborhood varchar(64) NOT NULL,
    nomenclature varchar(64) NOT NULL,
    additional_information text NULL,
    CONSTRAINT address_pk PRIMARY KEY (id)
);

-- Table: announcement
CREATE TABLE announcement (
    id int NOT NULL AUTO_INCREMENT,
    created_at date NOT NULL,
    update_at timestamp NOT NULL,
    content text NOT NULL,
    user_id int NOT NULL,
    CONSTRAINT announcement_pk PRIMARY KEY (id)
);

-- Table: client
CREATE TABLE client (
    id int NOT NULL AUTO_INCREMENT,
    legal_name varchar(256) NOT NULL,
    nit varchar(32) NOT NULL,
    trade_name varchar(256) NOT NULL,
    manager_name varchar(256) NULL,
    manager_phonenumber varchar(32) NULL,
    business_phonenumber varchar(32) NULL,
    additional_information text NULL,
    bill_address int NULL,
    delivery_address int NULL,
    user int NOT NULL,
    CONSTRAINT client_pk PRIMARY KEY (id)
);

-- Table: client_employee
CREATE TABLE client_employee (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(256) NOT NULL,
    state char(1) NOT NULL,
    phonenumber varchar(32) NOT NULL,
    role varchar(32) NOT NULL,
    client int NOT NULL,
    CONSTRAINT client_employee_pk PRIMARY KEY (id)
);

-- Table: client_product
CREATE TABLE client_product (
    id int NOT NULL AUTO_INCREMENT,
    client int NOT NULL,
    custom_name varchar(64) NULL,
    product_codigo varchar(8) NOT NULL,
    CONSTRAINT client_product_pk PRIMARY KEY (id)
);

-- Table: element
CREATE TABLE element (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(64) NOT NULL,
    CONSTRAINT element_pk PRIMARY KEY (id)
);

-- Table: employee
CREATE TABLE employee (
    id int NOT NULL AUTO_INCREMENT,
    user int NOT NULL,
    name varchar(256) NOT NULL,
    CONSTRAINT employee_pk PRIMARY KEY (id)
);

-- Table: item
CREATE TABLE item (
    id int NOT NULL AUTO_INCREMENT,
    value varchar(64) NOT NULL,
    short_value varchar(8) NOT NULL,
    element int NOT NULL,
    UNIQUE INDEX item_ak_1 (value),
    CONSTRAINT item_pk PRIMARY KEY (id)
);

-- Table: item_product
CREATE TABLE item_product (
    id int NOT NULL AUTO_INCREMENT,
    item_id int NOT NULL,
    product_codigo varchar(8) NOT NULL,
    CONSTRAINT item_product_pk PRIMARY KEY (id)
);

-- Table: order
CREATE TABLE `order` (
    id int NOT NULL AUTO_INCREMENT,
    created_at date NOT NULL,
    delivery_date date NOT NULL,
    state varchar(64) NOT NULL,
    initial_suggested_time varchar(8) NULL,
    final_suggested_time varchar(8) NULL,
    additional_information text NULL,
    obsevation text NULL,
    client int NOT NULL,
    client_employee int NOT NULL,
    CONSTRAINT order_pk PRIMARY KEY (id)
);

-- Table: order_product
CREATE TABLE order_product (
    id int NOT NULL AUTO_INCREMENT,
    client_product int NOT NULL,
    `order` int NOT NULL,
    amount int NOT NULL,
    baked char(1) NOT NULL,
    CONSTRAINT order_product_pk PRIMARY KEY (id)
);

-- Table: product
CREATE TABLE product (
    code varchar(8) NOT NULL,
    name varchar(128) NOT NULL,
    short_name varchar(64) NOT NULL,
    CONSTRAINT product_pk PRIMARY KEY (code)
);

-- Table: user
CREATE TABLE user (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(64) NOT NULL,
    password varchar(256) NOT NULL,
    role varchar(32) NOT NULL,
    state char(1) NOT NULL,
    UNIQUE INDEX user_ak_1 (username),
    CONSTRAINT user_pk PRIMARY KEY (id)
);

-- foreign keys
-- Reference: announcement_user (table: announcement)
ALTER TABLE announcement ADD CONSTRAINT announcement_user FOREIGN KEY announcement_user (user_id)
    REFERENCES user (id);

-- Reference: client_address1 (table: client)
ALTER TABLE client ADD CONSTRAINT client_address1 FOREIGN KEY client_address1 (bill_address)
    REFERENCES address (id);

-- Reference: client_address2 (table: client)
ALTER TABLE client ADD CONSTRAINT client_address2 FOREIGN KEY client_address2 (delivery_address)
    REFERENCES address (id);

-- Reference: client_employee_client (table: client_employee)
ALTER TABLE client_employee ADD CONSTRAINT client_employee_client FOREIGN KEY client_employee_client (client)
    REFERENCES client (id);

-- Reference: client_product_client (table: client_product)
ALTER TABLE client_product ADD CONSTRAINT client_product_client FOREIGN KEY client_product_client (client)
    REFERENCES client (id);

-- Reference: client_product_product (table: client_product)
ALTER TABLE client_product ADD CONSTRAINT client_product_product FOREIGN KEY client_product_product (product_codigo)
    REFERENCES product (code);

-- Reference: client_user (table: client)
ALTER TABLE client ADD CONSTRAINT client_user FOREIGN KEY client_user (user)
    REFERENCES user (id);

-- Reference: employee_user (table: employee)
ALTER TABLE employee ADD CONSTRAINT employee_user FOREIGN KEY employee_user (user)
    REFERENCES user (id);

-- Reference: item_element (table: item)
ALTER TABLE item ADD CONSTRAINT item_element FOREIGN KEY item_element (element)
    REFERENCES element (id);

-- Reference: item_product_item (table: item_product)
ALTER TABLE item_product ADD CONSTRAINT item_product_item FOREIGN KEY item_product_item (item_id)
    REFERENCES item (id);

-- Reference: item_product_product (table: item_product)
ALTER TABLE item_product ADD CONSTRAINT item_product_product FOREIGN KEY item_product_product (product_codigo)
    REFERENCES product (code);

-- Reference: order_client (table: order)
ALTER TABLE `order` ADD CONSTRAINT order_client FOREIGN KEY order_client (client)
    REFERENCES client (id);

-- Reference: order_client_employee (table: order)
ALTER TABLE `order` ADD CONSTRAINT order_client_employee FOREIGN KEY order_client_employee (client_employee)
    REFERENCES client_employee (id);

-- Reference: order_product_client_product (table: order_product)
ALTER TABLE order_product ADD CONSTRAINT order_product_client_product FOREIGN KEY order_product_client_product (client_product)
    REFERENCES client_product (id);

-- Reference: order_product_order (table: order_product)
ALTER TABLE order_product ADD CONSTRAINT order_product_order FOREIGN KEY order_product_order (`order`)
    REFERENCES `order` (id);

-- End of file.

