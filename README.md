# 🛒 FreshMart — Grocery Store Management System

A production-ready full-stack web application for managing a grocery store's products, orders, and inventory.

**Stack:** Python Flask · MySQL · HTML/CSS/JS · Bootstrap 5

---

## 📁 Project Structure

```
grocery-webapp/
├── backend/
│   ├── server.py           # Flask app + all REST API routes
│   ├── sql_connection.py   # MySQL connection manager
│   ├── products_dao.py     # Product CRUD operations
│   ├── orders_dao.py       # Order insert + fetch
│   ├── uom_dao.py          # Unit of measurement queries
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variable template
│
├── frontend/
│   ├── index.html          # Dashboard
│   ├── manage-product.html # Product management page
│   ├── order.html          # Order placement + history
│   ├── css/
│   │   └── style.css       # Custom styles + CSS variables
│   └── js/
│       ├── config.js       # API base URL config
│       ├── utils.js        # Shared utilities (toast, fetch helper)
│       ├── products.js     # Product page logic
│       └── orders.js       # Order page logic
│
├── database/
│   └── schema.sql          # MySQL schema + seed data
│
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites
- Python 3.8+
- MySQL 8.0+
- pip

### Step 1 — Set up MySQL

```bash
# Log into MySQL
mysql -u root -p

# Run the schema file
source /path/to/grocery-webapp/database/schema.sql;
```

### Step 2 — Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=grocery_store
DB_PORT=3306
```

### Step 3 — Install Python Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 4 — Start the Backend

```bash
python server.py
```

Backend runs at: **http://localhost:5000**

### Step 5 — Open the Frontend

Open `frontend/index.html` directly in your browser, or use the Live Server extension in VS Code.

Make sure `frontend/js/config.js` has:
```js
API_BASE_URL: "http://localhost:5000"
```

---

## 🌐 REST API Reference

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/`                 | Health check             |
| GET    | `/uom`              | Get all UOM types        |
| GET    | `/products`         | Get all products         |
| POST   | `/products`         | Add a new product        |
| PUT    | `/products/<id>`    | Update a product         |
| DELETE | `/products/<id>`    | Delete a product         |
| GET    | `/orders`           | Get all orders           |
| POST   | `/orders`           | Place a new order        |

### Example POST /products
```json
{
  "name": "Basmati Rice",
  "uom_id": 1,
  "price_per_unit": 85.00
}
```

### Example POST /orders
```json
{
  "customer_name": "Ravi Kumar",
  "grand_total": 255.00,
  "order_details": [
    { "product_id": 1, "quantity": 3, "total_price": 255.00 }
  ]
}
```

---

## ☁️ Deployment Guide

### Backend → Render

1. Push your project to GitHub.
2. Go to [render.com](https://render.com) → **New → Web Service**.
3. Connect your GitHub repo.
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn server:app`
   - **Environment:** Python 3
5. Add environment variables in Render dashboard:
   ```
   DB_HOST      = your-mysql-host
   DB_USER      = your-user
   DB_PASSWORD  = your-password
   DB_NAME      = grocery_store
   DB_PORT      = 3306
   ```
6. Deploy. Note your Render URL (e.g. `https://freshmart-api.onrender.com`).

> 💡 For MySQL in production, use **PlanetScale**, **Railway**, or **Amazon RDS**.

### Frontend → Netlify / Vercel

1. Update `frontend/js/config.js`:
   ```js
   API_BASE_URL: "https://freshmart-api.onrender.com"
   ```
2. **Netlify:** Drag & drop the `frontend/` folder at [netlify.com](https://netlify.com).
3. **Vercel:** Run `vercel` in the `frontend/` directory.

---

## ✨ Features

- ✅ Full CRUD for products (add, edit, delete, view)
- ✅ Multi-item order placement with auto-calculated totals
- ✅ Complete order history with line items
- ✅ Responsive sidebar dashboard (mobile-friendly)
- ✅ Toast notifications for all actions
- ✅ Environment variable support (`.env`)
- ✅ CORS enabled for cross-origin frontend
- ✅ Gunicorn-ready for production deployment
- ✅ MySQL schema with seed data

---

## 🛠️ Tech Stack

| Layer    | Technology                |
|----------|---------------------------|
| Frontend | HTML5, CSS3, JavaScript   |
| UI       | Bootstrap 5               |
| Backend  | Python, Flask             |
| Database | MySQL                     |
| ORM      | mysql-connector-python    |
| Server   | Gunicorn                  |
| Deploy   | Render + Netlify          |

---

## 📄 License

MIT License — free to use and modify.
