import os
import sqlite3
from dotenv import load_dotenv

try:
    import mysql.connector
    from mysql.connector import Error as MySQLError
    HAS_MYSQL_DRIVER = True
except ImportError:
    HAS_MYSQL_DRIVER = False
    MySQLError = Exception

load_dotenv()

MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
MYSQL_PORT = int(os.getenv('MYSQL_PORT', 3306))
MYSQL_USER = os.getenv('MYSQL_USER', 'root')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'Usman@123')
MYSQL_DB = os.getenv('MYSQL_DB', 'supplyiq')

# SQLite fallback path
SQLITE_DB_PATH = os.path.join(os.path.dirname(__file__), 'routesense.db')

# Engine flag: None = untested, False = MySQL active, True = SQLite fallback active
USE_SQLITE = None


class SQLiteCursorAdapter:
    """Adapts an sqlite3 cursor to behave identically to mysql-connector cursor."""
    def __init__(self, cursor):
        self._cursor = cursor
        self.lastrowid = None

    def execute(self, query, params=None):
        adapted_query = query.replace('%s', '?')
        # Remove MySQL-specific clauses if present in query
        adapted_query = adapted_query.replace('ON UPDATE CURRENT_TIMESTAMP', '')
        if params is not None:
            self._cursor.execute(adapted_query, params)
        else:
            self._cursor.execute(adapted_query)
        self.lastrowid = self._cursor.lastrowid
        return self

    def fetchone(self):
        return self._cursor.fetchone()

    def fetchall(self):
        return self._cursor.fetchall()

    def close(self):
        try:
            self._cursor.close()
        except Exception:
            pass


class SQLiteConnectionAdapter:
    """Adapts an sqlite3 connection to match mysql.connector autocommit interface."""
    def __init__(self, conn):
        self._conn = conn

    def cursor(self):
        return SQLiteCursorAdapter(self._conn.cursor())

    def commit(self):
        self._conn.commit()

    def close(self):
        try:
            self._conn.close()
        except Exception:
            pass


def get_db_connection(include_db=True):
    """
    Returns an active database connection.
    Attempts MySQL first; if unreachable, transparently falls back to SQLite.
    """
    global USE_SQLITE

    # If SQLite has already been selected, return SQLite directly
    if USE_SQLITE is True:
        conn = sqlite3.connect(SQLITE_DB_PATH, timeout=10)
        conn.isolation_level = None  # Autocommit mode
        return SQLiteConnectionAdapter(conn)

    # Try MySQL if driver is available
    if HAS_MYSQL_DRIVER and USE_SQLITE is not True:
        try:
            connection_args = {
                'host': MYSQL_HOST,
                'port': MYSQL_PORT,
                'user': MYSQL_USER,
                'password': MYSQL_PASSWORD,
                'connection_timeout': 3,
                'autocommit': True
            }
            if include_db:
                connection_args['database'] = MYSQL_DB

            conn = mysql.connector.connect(**connection_args)
            USE_SQLITE = False
            return conn
        except Exception as e:
            if USE_SQLITE is None:
                print(f"[Database] MySQL unreachable ({e}). Using embedded SQLite database at '{SQLITE_DB_PATH}'.")
            USE_SQLITE = True

    # Fallback to SQLite
    conn = sqlite3.connect(SQLITE_DB_PATH, timeout=10)
    conn.isolation_level = None  # Autocommit mode
    return SQLiteConnectionAdapter(conn)


def init_db(schema_file=None):
    """
    Initializes database tables.
    Supports both MySQL (via schema.sql) and embedded SQLite.
    """
    global USE_SQLITE

    # Attempt MySQL initialization first
    if HAS_MYSQL_DRIVER and USE_SQLITE is not True:
        try:
            if schema_file is None:
                schema_file = os.path.join(os.path.dirname(__file__), 'schema.sql')

            connection = get_db_connection(include_db=False)
            if not USE_SQLITE:
                cursor = connection.cursor()
                if os.path.exists(schema_file):
                    with open(schema_file, 'r', encoding='utf-8') as f:
                        sql_script = f.read()
                    statements = [stmt.strip() for stmt in sql_script.split(';') if stmt.strip()]
                    for statement in statements:
                        cursor.execute(statement)
                cursor.close()
                connection.close()
                print(f"[Database] MySQL database '{MYSQL_DB}' and tables initialized successfully.")
                return True
        except Exception as e:
            print(f"[Database] MySQL init failed ({e}). Initializing SQLite fallback...")
            USE_SQLITE = True

    # SQLite Table Initializer
    try:
        conn = sqlite3.connect(SQLITE_DB_PATH)
        c = conn.cursor()

        c.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        c.execute("""
            CREATE TABLE IF NOT EXISTS shipments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                shipment_id TEXT UNIQUE NOT NULL,
                origin TEXT NOT NULL,
                destination TEXT NOT NULL,
                distance REAL NOT NULL,
                weather TEXT NOT NULL,
                route_risk TEXT NOT NULL,
                delivery_status TEXT NOT NULL,
                delay_days INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        c.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                shipment_id INTEGER,
                predicted_risk TEXT NOT NULL,
                prediction_confidence REAL DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Seed default dispatcher user if empty
        c.execute("SELECT COUNT(*) FROM users")
        if c.fetchone()[0] == 0:
            from werkzeug.security import generate_password_hash
            default_pass_hash = generate_password_hash('RouteSense2026!')
            c.execute(
                "INSERT INTO users (username, password_hash) VALUES (?, ?)",
                ('dispatcher', default_pass_hash)
            )
            print("[Database] Seeded initial dispatcher account: 'dispatcher' / 'RouteSense2026!'")

        conn.commit()
        conn.close()
        print(f"[Database] SQLite tables initialized successfully at '{SQLITE_DB_PATH}'.")
        return True
    except Exception as e:
        print(f"[Database] Error initializing SQLite database: {e}")
        return False


if __name__ == '__main__':
    init_db()
