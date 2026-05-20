-- =============================================================
-- Grocery Store Management System - MySQL Schema
-- Run this file once to initialize your database.
-- =============================================================

-- Create and select the database
CREATE DATABASE IF NOT EXISTS grocery_store;
USE grocery_store;

-- -------------------------------------------------------------
-- Table: uom_master
-- Stores units of measurement (e.g., kg, litre, dozen)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS uom_master (
    uom_id   INT          NOT NULL AUTO_INCREMENT,
    uom_name VARCHAR(50)  NOT NULL,
    PRIMARY KEY (uom_id)
);

-- -------------------------------------------------------------
-- Table: products_master
-- Stores all products available in the grocery store
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products_master (
    product_id     INT           NOT NULL AUTO_INCREMENT,
    name           VARCHAR(100)  NOT NULL,
    uom_id         INT           NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (product_id),
    FOREIGN KEY (uom_id) REFERENCES uom_master(uom_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- -------------------------------------------------------------
-- Table: orders
-- Stores order header information
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    order_id      INT           NOT NULL AUTO_INCREMENT,
    customer_name VARCHAR(100)  NOT NULL,
    total         DECIMAL(10,2) NOT NULL,
    datetime      DATETIME      NOT NULL,
    PRIMARY KEY (order_id)
);

-- -------------------------------------------------------------
-- Table: order_details
-- Stores each line item within an order
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_details (
    order_detail_id INT           NOT NULL AUTO_INCREMENT,
    order_id        INT           NOT NULL,
    product_id      INT           NOT NULL,
    quantity        DECIMAL(10,2) NOT NULL,
    total_price     DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_detail_id),
    FOREIGN KEY (order_id)   REFERENCES orders(order_id)          ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products_master(product_id) ON DELETE RESTRICT
);

-- -------------------------------------------------------------
-- Seed Data: Units of Measurement
-- -------------------------------------------------------------
INSERT INTO uom_master (uom_name) VALUES
    ('kg'),
    ('litre'),
    ('dozen'),
    ('piece'),
    ('packet'),
    ('gram'),
    ('ml');

-- -------------------------------------------------------------
-- Seed Data: Sample Products
-- -------------------------------------------------------------
INSERT INTO products_master (name, uom_id, price_per_unit) VALUES
    ('Rice (Basmati)',     1, 85.00),
    ('Wheat Flour',       1, 45.00),
    ('Mustard Oil',       2, 180.00),
    ('Sunflower Oil',     2, 150.00),
    ('Eggs',              3, 75.00),
    ('Onion',             1, 30.00),
    ('Tomato',            1, 40.00),
    ('Potato',            1, 25.00),
    ('Sugar',             1, 42.00),
    ('Salt',              6, 20.00),
    ('Milk',              2, 58.00),
    ('Bread',             4, 35.00),
    ('Butter',            6, 55.00),
    ('Cheese',            6, 320.00),
    ('Tea Leaves',        5, 90.00);

-- Done!
SELECT 'Schema and seed data loaded successfully! 🎉' AS status;
