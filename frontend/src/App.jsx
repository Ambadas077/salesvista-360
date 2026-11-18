import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const inr = (v) => v >= 1e7 ? `₹${(v / 1e7).toFixed(2)} Cr` : v >= 1e5 ? `₹${(v / 1e5).toFixed(2)} L` : `₹${Math.round(v).toLocaleString("en-IN")}`;
const COLORS = ["#2563eb", "#f97316", "#16a34a", "#9333ea"];

export default function App() {
  const [f, setF] = useState({ year: "", region: "", category: "" });
  const [d, setD] = useState({});
  useEffect(() => {
    const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
    const get = (p) => fetch(`/api/${p}?${qs}`).then((r) => r.json());
    Promise.all(["kpis", "monthly", "by-category", "by-region", "top-products", "salespeople"].map(get))
      .then(([kpis, monthly, cat, reg, prod, sp]) => setD({ kpis, monthly, cat, reg, prod, sp }))
      .catch(console.error);
  }, [f]);
  const k = d.kpis;
  const sel = (key, opts) => (
    <select value={f[key]} onChange={(e) => setF({ ...f, [key]: e.target.value })}>
      <option value="">All {key}s</option>{opts.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
  if (!k) return <p>Loading… (is the backend running on port 8080?)</p>;
  const cards = [["Total sales", inr(k.sales)], ["Total profit", inr(k.profit)], ["Orders", k.orders], ["Customers", k.customers],
    ["Avg order value", inr(k.orders ? k.sales / k.orders : 0)], ["Profit margin", `${(k.sales ? (k.profit / k.sales) * 100 : 0).toFixed(1)}%`],
    ["Units sold", k.units], ["Return rate", `${Number(k.returnRate).toFixed(1)}%`]];
  return (
    <>
      <header><h1>Sales Performance Analytics</h1>
        <div>{sel("year", [2024, 2025, 2026])}{sel("region", ["West", "South", "North", "East"])}{sel("category", ["Technology", "Furniture", "Office Supplies"])}</div></header>
      <div className="kpis">{cards.map(([t, v]) => <div className="card kpi" key={t}><span>{t}</span><b>{v}</b></div>)}</div>
      <div className="grid">
        <div className="card"><h2>Monthly sales and profit</h2><ResponsiveContainer height={260}><LineChart data={d.monthly}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tickFormatter={inr} width={70} tick={{ fontSize: 11 }} /><Tooltip formatter={inr} /><Legend /><Line dataKey="sales" stroke="#2563eb" dot={false} /><Line dataKey="profit" stroke="#16a34a" dot={false} /></LineChart></ResponsiveContainer></div>
        <div className="card"><h2>By category</h2><ResponsiveContainer height={260}><BarChart data={d.cat}><XAxis dataKey="name" /><YAxis tickFormatter={inr} width={70} tick={{ fontSize: 11 }} /><Tooltip formatter={inr} /><Legend /><Bar dataKey="sales" fill="#2563eb" /><Bar dataKey="profit" fill="#f97316" /></BarChart></ResponsiveContainer></div>
      </div>
      <div className="grid">
        <div className="card"><h2>Sales by region</h2><ResponsiveContainer height={260}><PieChart><Pie data={d.reg} dataKey="sales" nameKey="name" innerRadius={55} outerRadius={90}>{d.reg.map((_, i) => <Cell key={i} fill={COLORS[i % 4]} />)}</Pie><Tooltip formatter={inr} /><Legend /></PieChart></ResponsiveContainer></div>
        <div className="card"><h2>Top 10 products</h2><ResponsiveContainer height={260}><BarChart data={d.prod} layout="vertical"><XAxis type="number" tickFormatter={inr} tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} /><Tooltip formatter={inr} /><Bar dataKey="sales" fill="#2563eb" /></BarChart></ResponsiveContainer></div>
      </div>
      <div className="card"><h2>Salesperson ranking</h2>
        <table><thead><tr><th>Name</th><th>Orders</th><th>Sales</th><th>Profit</th></tr></thead>
          <tbody>{d.sp.map((s) => <tr key={s.name}><td>{s.name}</td><td>{s.orders}</td><td>{inr(s.sales)}</td><td>{inr(s.profit)}</td></tr>)}</tbody></table></div>
    </>
  );
}
