# Sales Performance Analytics Dashboard

Full-stack portfolio project: **MySQL** (star schema) + **Spring Boot** REST API + **React** (Recharts) dashboard.

## Business questions answered
Top products, best regions, top salespeople, most profitable customers, best months, low-profit categories, and where to invest.

## Structure
- `standalone/sales-dashboard.html` – zero-setup demo (open in a browser)
- `database/` – `schema.sql`, `generate_data.py`, `queries.sql` (CTEs, window functions, views, indexes)
- `backend/` – Spring Boot 3 (Java 17) REST API: `/api/kpis`, `/monthly`, `/by-category`, `/by-region`, `/top-products`, `/salespeople` (filters: `year`, `region`, `category`)
- `frontend/` – React + Vite dashboard with filters, KPI cards and charts

## Run it
1. **Database**
   ```
   cd database
   python generate_data.py
   mysql -u root -p < schema.sql
   mysql -u root -p < data.sql
   ```
2. **Backend** – set your MySQL password in `backend/src/main/resources/application.properties`, then:
   ```
   cd backend && mvn spring-boot:run
   ```
3. **Frontend**
   ```
   cd frontend && npm install && npm run dev
   ```
   Open http://localhost:5173

## Skills demonstrated
SQL joins, CTEs, window functions, views, indexes · REST API design with parameterised queries · React hooks and data visualisation · KPI design (sales, profit, margin, AOV, return rate, MoM growth)

## Ideas to extend
Customer and order drill-through pages, geo map, sales targets table, Docker Compose, GitHub Actions CI.
