USE sales_db;
-- 1. MoM growth (window function)
SELECT ym, sales, ROUND((sales / LAG(sales) OVER (ORDER BY ym) - 1) * 100, 2) AS mom_pct FROM vw_monthly_sales;
-- 2. Running total / YTD
SELECT ym, SUM(sales) OVER (PARTITION BY LEFT(ym,4) ORDER BY ym) AS ytd_sales FROM vw_monthly_sales;
-- 3. Product ranking by profit
SELECT p.product_name, SUM(f.profit) AS profit, RANK() OVER (ORDER BY SUM(f.profit) DESC) AS rnk
FROM fact_sales f JOIN dim_product p USING (product_id) GROUP BY p.product_name;
-- 4. Customer lifetime value and repeat customers (CTE)
WITH c AS (SELECT customer_id, COUNT(*) AS orders, SUM(sales) AS clv FROM fact_sales GROUP BY customer_id)
SELECT cu.customer_name, c.orders, c.clv, c.orders > 1 AS is_repeat FROM c JOIN dim_customer cu USING (customer_id) ORDER BY clv DESC LIMIT 10;
-- 5. Loss-making products
SELECT p.product_name, SUM(f.profit) AS profit FROM fact_sales f JOIN dim_product p USING (product_id)
GROUP BY p.product_name HAVING profit < 0;
-- 6. Average delivery days by shipping mode
SELECT ship_mode, ROUND(AVG(DATEDIFF(ship_date, order_date)),1) AS avg_days FROM fact_sales GROUP BY ship_mode;
