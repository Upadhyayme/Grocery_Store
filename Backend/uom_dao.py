"""
uom_dao.py
----------
Data Access Object for Units of Measurement (UOM).
Handles all database queries related to UOM.
"""

from sql_connection import get_sql_connection


def get_uoms():
    """
    Fetches all units of measurement from the database.
    Returns a list of dicts: [{uom_id, uom_name}, ...]
    """
    connection = get_sql_connection()
    cursor = connection.cursor(dictionary=True)  # Returns rows as dicts

    query = "SELECT uom_id, uom_name FROM uom_master ORDER BY uom_name ASC"
    cursor.execute(query)

    rows = cursor.fetchall()
    cursor.close()
    return rows
