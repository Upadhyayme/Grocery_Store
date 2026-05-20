# 🛒 FreshMart — Grocery Store Management System

A production-ready full-stack web application for managing a grocery store's products, orders, and inventory.

**Stack:** Python Flask · MySQL · HTML/CSS/JS · Bootstrap 5

## 📁 Project Structure

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


## 🚀 Local Development Setup

### Prerequisites
- Python 3.8+
- MySQL 8.0+
- pip

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
