import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()

MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
MYSQL_PORT = int(os.getenv('MYSQL_PORT', 3306))
MYSQL_USER = os.getenv('MYSQL_USER', 'root')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'Usman@123')
MYSQL_DB = os.getenv('MYSQL_DB', 'supplyiq')


def get_db_connection(include_db=True):
    """
    Returns a MySQL database connection using parameterized connection properties.
    """
    try:
        connection_args = {
            'host': MYSQL_HOST,
            'port': MYSQL_PORT,
            'user': MYSQL_USER,
            'password': MYSQL_PASSWORD,
            'autocommit': True
        }
        if include_db:
            connection_args['database'] = MYSQL_DB

        connection = mysql.connector.connect(**connection_args)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        raise e


def init_db(schema_file=None):
    """
    Initializes the database by executing schema.sql.
    First connects to MySQL server without selecting a DB, runs the schema statements individually.
    """
    if schema_file is None:
        schema_file = os.path.join(os.path.dirname(__file__), 'schema.sql')

    try:
        connection = get_db_connection(include_db=False)
        cursor = connection.cursor()

        if not os.path.exists(schema_file):
            print(f"Schema file '{schema_file}' not found.")
            return False

        with open(schema_file, 'r', encoding='utf-8') as f:
            sql_script = f.read()

        # Split SQL statements cleanly by semicolon
        statements = [stmt.strip() for stmt in sql_script.split(';') if stmt.strip()]
        for statement in statements:
            cursor.execute(statement)

        cursor.close()
        connection.close()
        print(f"Database '{MYSQL_DB}' and tables initialized successfully using {schema_file}.")
        return True
    except Error as e:
        print(f"Error initializing MySQL database: {e}")
        return False


if __name__ == '__main__':
    init_db()
