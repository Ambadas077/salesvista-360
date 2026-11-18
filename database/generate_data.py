"""Generates data.sql with sample rows. Run: python generate_data.py"""
import random, datetime as dt
random.seed(42)
RG={"West":["Maharashtra","Gujarat"],"South":["Karnataka","Tamil Nadu"],"North":["Delhi","Punjab"],"East":["West Bengal","Odisha"]}
SP=[("Neha Joshi","West"),("Rahul Mehta","West"),("Suresh Rao","South"),("Lakshmi N","South"),("Amit Verma","North"),("Pooja Bedi","North"),("Sourav Ghosh","East"),("Rina Sen","East")]
P=[("Laptop","Technology",55000,.78),("Smartphone","Technology",30000,.8),("Tablet","Technology",22000,.8),("Monitor","Technology",14000,.75),("Headphones","Technology",4000,.6),("Office Chair","Furniture",9000,.7),("Standing Desk","Furniture",18000,.82),("Bookcase","Furniture",6000,.9),("Notebook Pack","Office Supplies",400,.55),("Printer Paper","Office Supplies",650,.6),("Stapler Set","Office Supplies",350,.65),("Binder","Office Supplies",250,.7)]
F=["Aarav","Diya","Rohan","Sneha","Vikram","Meera","Arjun","Isha","Karan","Priya"]
L=["Sharma","Patil","Reddy","Nair","Gupta","Kulkarni","Das","Singh","Iyer","Shah"]
out=["USE sales_db;"]
out+=[f"INSERT INTO dim_salesperson VALUES ({i+1},'{n}','{r}');" for i,(n,r) in enumerate(SP)]
out+=[f"INSERT INTO dim_product VALUES ({i+1},'{n}','{c}','Generic',{p*k:.2f},{p});" for i,(n,c,p,k) in enumerate(P)]
for i in range(100):
    st=random.choice([s for v in RG.values() for s in v])
    out.append(f"INSERT INTO dim_customer VALUES ({i+1},'{F[i%10]} {L[i//10]}','{random.choice(['M','F'])}',{random.randint(18,65)},'{random.choice(['Consumer','Corporate','Home Office'])}','{st} City','{st}');")
rows=[];start=dt.date(2024,1,1)
while len(rows)<3200:
    d=start+dt.timedelta(days=random.randint(0,1033)); mo=d.month
    if random.random()*1.6>1+.5*(mo>=10): continue
    pi=random.randrange(len(P)); n,c,price,k=P[pi]; si=random.randrange(8); reg=SP[si][1]
    q=random.randint(1,4); disc=random.choice([0,0,.05,.1,.2,.3]); sales=price*q*(1-disc); cost=price*k*q
    ship=d+dt.timedelta(days=random.randint(1,7))
    rows.append(f"('{d}','{ship}',{random.randint(1,100)},{pi+1},{si+1},'{reg}','{random.choice(RG[reg])}',{q},{disc},{sales:.2f},{cost:.2f},{sales-cost:.2f},'{random.choice(['Standard','Express','Same Day'])}',{int(random.random()<.06)})")
for i in range(0,len(rows),200):
    out.append("INSERT INTO fact_sales (order_date,ship_date,customer_id,product_id,salesperson_id,region,state,quantity,discount,sales,cost,profit,ship_mode,returned) VALUES\n"+",\n".join(rows[i:i+200])+";")
open("data.sql","w").write("\n".join(out)); print("data.sql written")
