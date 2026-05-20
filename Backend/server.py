"""
server.py
---------
Main Flask application entry point.
Defines all REST API routes and starts the development server.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS

import products_dao
import orders_dao
import uom_dao

# ── App Setup ────────────────────────────────────────────────────────────────
# Flask app variable must be named 'app' for Gunicorn compatibility
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing so the frontend (on a different domain)
# can call our API. In production, replace "*" with your actual frontend URL.
CORS(app, resources={r"/*": {"origins": "*"}})


# ── Health Check ─────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def health_check():
    """Simple health check endpoint for deployment platforms."""
    return jsonify({"status": "ok", "message": "Grocery Store API is running 🛒"})


# ── UOM Endpoints ─────────────────────────────────────────────────────────────
@app.route("/uom", methods=["GET"])
def get_uom():
    """Returns all units of measurement (kg, litre, dozen, etc.)."""
    try:
        uoms = uom_dao.get_uoms()
        return jsonify(uoms), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Product Endpoints ──────────────────────────────────────────────────────────
@app.route("/products", methods=["GET"])
def get_products():
    """Returns all products with their UOM details."""
    try:
        products = products_dao.get_all_products()
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/products", methods=["POST"])
def add_product():
    """
    Creates a new product.
    Expected JSON body: { "name": str, "uom_id": int, "price_per_unit": float }
    """
    try:
        data = request.get_json()

        # Validate required fields
        required = ["name", "uom_id", "price_per_unit"]
        for field in required:
            if field not in data or data[field] == "":
                return jsonify({"error": f"'{field}' is required."}), 400

        # Validate price is a positive number
        price = float(data["price_per_unit"])
        if price <= 0:
            return jsonify({"error": "Price must be greater than 0."}), 400

        product_id = products_dao.insert_new_product(data)
        return jsonify({"product_id": product_id, "message": "Product added successfully!"}), 201

    except ValueError:
        return jsonify({"error": "Invalid price format."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    """
    Updates an existing product.
    Expected JSON body: { "name": str, "uom_id": int, "price_per_unit": float }
    """
    try:
        data = request.get_json()
        data["product_id"] = product_id  # Inject ID from URL into the dict

        required = ["name", "uom_id", "price_per_unit"]
        for field in required:
            if field not in data or data[field] == "":
                return jsonify({"error": f"'{field}' is required."}), 400

        price = float(data["price_per_unit"])
        if price <= 0:
            return jsonify({"error": "Price must be greater than 0."}), 400

        affected = products_dao.update_product(data)
        if affected == 0:
            return jsonify({"error": "Product not found."}), 404

        return jsonify({"message": "Product updated successfully!"}), 200

    except ValueError:
        return jsonify({"error": "Invalid price format."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    """Deletes a product by its ID."""
    try:
        affected = products_dao.delete_product(product_id)
        if affected == 0:
            return jsonify({"error": "Product not found."}), 404
        return jsonify({"message": "Product deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Order Endpoints ────────────────────────────────────────────────────────────
@app.route("/orders", methods=["GET"])
def get_orders():
    """Returns all orders with their line items."""
    try:
        orders = orders_dao.get_all_orders()
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/orders", methods=["POST"])
def place_order():
    """
    Places a new order.
    Expected JSON body:
    {
        "customer_name": str,
        "grand_total": float,
        "order_details": [
            { "product_id": int, "quantity": float, "total_price": float },
            ...
        ]
    }
    """
    try:
        data = request.get_json()

        if not data.get("customer_name"):
            return jsonify({"error": "Customer name is required."}), 400

        if not data.get("order_details") or len(data["order_details"]) == 0:
            return jsonify({"error": "Order must have at least one item."}), 400

        order_id = orders_dao.insert_new_order(data)
        return jsonify({"order_id": order_id, "message": "Order placed successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── App Entry Point ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # debug=True for local development only.
    # In production (Render/Gunicorn), this block is NOT used.
    app.run(debug=True, port=5000, host="0.0.0.0")
