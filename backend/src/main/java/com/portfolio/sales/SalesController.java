package com.portfolio.sales;

import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class SalesController {
    private final JdbcTemplate db;
    public SalesController(JdbcTemplate db) { this.db = db; }

    private static final String FROM = " FROM fact_sales f JOIN dim_product p ON f.product_id=p.product_id"
            + " JOIN dim_salesperson s ON f.salesperson_id=s.salesperson_id";

    // Builds a parameterised WHERE clause (no string concatenation of user input)
    private String where(Integer year, String region, String category, List<Object> args) {
        StringBuilder w = new StringBuilder(" WHERE 1=1");
        if (year != null) { w.append(" AND YEAR(f.order_date)=?"); args.add(year); }
        if (region != null && !region.isBlank()) { w.append(" AND f.region=?"); args.add(region); }
        if (category != null && !category.isBlank()) { w.append(" AND p.category=?"); args.add(category); }
        return w.toString();
    }

    private List<Map<String, Object>> run(String select, String tail, Integer y, String r, String c) {
        List<Object> a = new ArrayList<>();
        return db.queryForList(select + FROM + where(y, r, c, a) + tail, a.toArray());
    }

    @GetMapping("/kpis")
    public Map<String, Object> kpis(@RequestParam(required = false) Integer year, @RequestParam(required = false) String region, @RequestParam(required = false) String category) {
        List<Object> a = new ArrayList<>();
        String sql = "SELECT COALESCE(SUM(f.sales),0) AS sales, COALESCE(SUM(f.profit),0) AS profit, COUNT(*) AS orders,"
                + " COUNT(DISTINCT f.customer_id) AS customers, COALESCE(SUM(f.quantity),0) AS units,"
                + " COALESCE(AVG(f.returned)*100,0) AS returnRate" + FROM + where(year, region, category, a);
        return db.queryForMap(sql, a.toArray());
    }

    @GetMapping("/monthly")
    public List<Map<String, Object>> monthly(@RequestParam(required = false) Integer year, @RequestParam(required = false) String region, @RequestParam(required = false) String category) {
        return run("SELECT DATE_FORMAT(f.order_date,'%Y-%m') AS month, SUM(f.sales) AS sales, SUM(f.profit) AS profit",
                " GROUP BY month ORDER BY month", year, region, category);
    }

    @GetMapping("/by-category")
    public List<Map<String, Object>> byCategory(@RequestParam(required = false) Integer year, @RequestParam(required = false) String region, @RequestParam(required = false) String category) {
        return run("SELECT p.category AS name, SUM(f.sales) AS sales, SUM(f.profit) AS profit", " GROUP BY p.category", year, region, category);
    }

    @GetMapping("/by-region")
    public List<Map<String, Object>> byRegion(@RequestParam(required = false) Integer year, @RequestParam(required = false) String region, @RequestParam(required = false) String category) {
        return run("SELECT f.region AS name, SUM(f.sales) AS sales, SUM(f.profit) AS profit", " GROUP BY f.region", year, region, category);
    }

    @GetMapping("/top-products")
    public List<Map<String, Object>> topProducts(@RequestParam(required = false) Integer year, @RequestParam(required = false) String region, @RequestParam(required = false) String category) {
        return run("SELECT p.product_name AS name, SUM(f.sales) AS sales, SUM(f.profit) AS profit",
                " GROUP BY p.product_name ORDER BY sales DESC LIMIT 10", year, region, category);
    }

    @GetMapping("/salespeople")
    public List<Map<String, Object>> salespeople(@RequestParam(required = false) Integer year, @RequestParam(required = false) String region, @RequestParam(required = false) String category) {
        return run("SELECT s.name AS name, SUM(f.sales) AS sales, SUM(f.profit) AS profit, COUNT(*) AS orders",
                " GROUP BY s.name ORDER BY sales DESC", year, region, category);
    }
}
