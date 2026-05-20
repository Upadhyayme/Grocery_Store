"""
sql_connection.py
-----------------
Handles MySQL database connection using environment variables.
Provides a singleton-style connection to reuse across DAOs.
"""

import mysql.connector
from dotenv import load_dotenv
import os

# Load variables from .env file
load_dotenv()

# Module-level variable to hold the connection (singleton pattern)
__connection = None


def get_sql_connection():
    """
    Returns an active MySQL connection.
    Creates a new one if none exists or if the previous one was lost.
    """
    global __connection

    # If no connection exists or it has been closed, create a new one
    if __connection is None or not __connection.is_connected():
        __connection = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "grocery_store"),
            port=int(os.getenv("DB_PORT", 3306)),
            autocommit=False,
            connection_timeout=30
        )
        print("✅ MySQL connection established.")

    return __connection
