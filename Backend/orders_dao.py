"""
orders_dao.py
-------------
Data Access Object for Orders.
Handles inserting new orders and retrieving order history.
"""

import math
from sql_connection import get_sql_connection


def get_all_orders():
    """
    Returns all orders with their line items and product details.
    Groups order details under each order for clean output.
    """
    connection = get_sql_connection()
    cursor = connection.cursor(dictionary=True)

    # Fetch all orders
    cursor.execute("""
        SELECT order_id, customer_name, total, datetime
        FROM orders
        ORDER BY datetime DESC
    """)
    orders = cursor.fetchall()

    # For each order, fetch its items
    order_details_cursor = connection.cursor(dictionary=True)
    for order in orders:
        order_details_cursor.execute("""
            SELECT
                od.order_detail_id,
                od.product_id,
                p.name AS product_name,
                od.quantity,
                od.total_price
            FROM order_details od
            INNER JOIN products_master p ON od.product_id = p.product_id
            WHERE od.order_id = %s
        """, (order["order_id"],))
        order["order_details"] = order_details_cursor.fetchall()

        # Convert datetime to string for JSON serialization
        if order["datetime"]:
            order["datetime"] = str(order["datetime"])

    order_details_cursor.close()
    cursor.close()
    return orders


def insert_new_order(order):
    """
    Inserts a new order along with its line items (order_details).

    order: dict with keys:
        - customer_name (str)
        - grand_total   (float)
        - order_details (list of dicts: product_id, quantity, total_price)

    Returns the new order's ID.
    """
    connection = get_sql_connection()
    cursor = connection.cursor()

    # 1. Insert the parent order record
    cursor.execute("""
        INSERT INTO orders (customer_name, total, datetime)
        VALUES (%s, %s, NOW())
    """, (order["customer_name"], math.floor(order["grand_total"])))

    order_id = cursor.lastrowid  # Get the auto-generated order ID

    # 2. Insert each line item (order detail)
    for item in order["order_details"]:
        cursor.execute("""
            INSERT INTO order_details (order_id, product_id, quantity, total_price)
            VALUES (%s, %s, %s, %s)
        """, (
            order_id,
            item["product_id"],
            item["quantity"],
            item["total_price"]
        ))

    connection.commit()
    cursor.close()
    return order_id
