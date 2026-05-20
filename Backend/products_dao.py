"""
products_dao.py
---------------
Data Access Object for Products.
Contains all CRUD operations for the products_master table.
"""

from sql_connection import get_sql_connection


def get_all_products():
    """
    Returns all products joined with their unit of measurement name.
    """
    connection = get_sql_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT
            p.product_id,
            p.name,
            p.uom_id,
            u.uom_name,
            p.price_per_unit
        FROM products_master p
        INNER JOIN uom_master u ON p.uom_id = u.uom_id
        ORDER BY p.name ASC
    """
    cursor.execute(query)
    rows = cursor.fetchall()
    cursor.close()
    return rows


def insert_new_product(product):
    """
    Inserts a new product into the database.
    product: dict with keys -> name, uom_id, price_per_unit
    Returns the new product's auto-generated ID.
    """
    connection = get_sql_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO products_master (name, uom_id, price_per_unit)
        VALUES (%s, %s, %s)
    """
    values = (product["name"], product["uom_id"], product["price_per_unit"])
    cursor.execute(query, values)
    connection.commit()

    new_id = cursor.lastrowid
    cursor.close()
    return new_id


def update_product(product):
    """
    Updates an existing product by product_id.
    product: dict with keys -> product_id, name, uom_id, price_per_unit
    Returns the number of rows affected.
    """
    connection = get_sql_connection()
    cursor = connection.cursor()

    query = """
        UPDATE products_master
        SET name = %s, uom_id = %s, price_per_unit = %s
        WHERE product_id = %s
    """
    values = (
        product["name"],
        product["uom_id"],
        product["price_per_unit"],
        product["product_id"]
    )
    cursor.execute(query, values)
    connection.commit()

    affected = cursor.rowcount
    cursor.close()
    return affected


def delete_product(product_id):
    """
    Deletes a product by its ID.
    Returns the number of rows deleted.
    """
    connection = get_sql_connection()
    cursor = connection.cursor()

    query = "DELETE FROM products_master WHERE product_id = %s"
    cursor.execute(query, (product_id,))
    connection.commit()

    affected = cursor.rowcount
    cursor.close()
    return affected
