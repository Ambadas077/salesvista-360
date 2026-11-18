CREATE DATABASE IF NOT EXISTS sales_db;
USE sales_db;
DROP VIEW IF EXISTS vw_monthly_sales;
DROP TABLE IF EXISTS fact_sales, dim_customer, dim_product, dim_salesperson;

CREATE TABLE dim_customer (
  customer_id INT PRIMARY KEY, customer_name VARCHAR(80), gender VARCHAR(10), age INT,
  segment VARCHAR(20), city VARCHAR(40), state VARCHAR(40));
CREATE TABLE dim_product (
  product_id INT PRIMARY KEY, product_name VARCHAR(80), category VARCHAR(40), brand VARCHAR(40),
  cost_price DECIMAL(10,2), selling_price DECIMAL(10,2));
CREATE TABLE dim_salesperson (
  salesperson_id INT PRIMARY KEY, name VARCHAR(60), region VARCHAR(20));
CREATE TABLE fact_sales (
  order_id INT PRIMARY KEY AUTO_INCREMENT, order_date DATE, ship_date DATE,
  customer_id INT, product_id INT, salesperson_id INT, region VARCHAR(20), state VARCHAR(40),
  quantity INT, discount DECIMAL(4,2), sales DECIMAL(12,2), cost DECIMAL(12,2), profit DECIMAL(12,2),
  ship_mode VARCHAR(20), returned BOOLEAN,
  FOREIGN KEY (customer_id) REFERENCES dim_customer(customer_id),
  FOREIGN KEY (product_id) REFERENCES dim_product(product_id),
  FOREIGN KEY (salesperson_id) REFERENCES dim_salesperson(salesperson_id),
  INDEX idx_date (order_date), INDEX idx_region (region), INDEX idx_product (product_id));

CREATE VIEW vw_monthly_sales AS
SELECT DATE_FORMAT(order_date,'%Y-%m') AS ym, SUM(sales) AS sales, SUM(profit) AS profit, COUNT(*) AS orders
FROM fact_sales GROUP BY DATE_FORMAT(order_date,'%Y-%m');
