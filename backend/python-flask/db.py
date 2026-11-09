"""
db.py — Supabase (PostgreSQL) database layer for RouteSense.

Connection is established via the DATABASE_URL environment variable
(Supabase → Project Settings → Database → Connection string → URI).

Format:
    postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres

Set this variable in:
  - .env              (local development)
  - Railway dashboard (production)
"""

import os
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    raise RuntimeError(
        "[Database] DATABASE_URL is not set. "
        "Add it to your .env file or Railway environment variables.\n"
        "Format: postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres"
    )


def get_db_connection():
    """
    Opens and returns a new psycopg2 connection to the Supabase PostgreSQL database.
    Uses autocommit so callers don't need to call .commit() manually.
    """
    conn = psycopg2.connect(DATABASE_URL, connect_timeout=10)
    conn.autocommit = True
    return conn


def init_db():
    """
    Creates all required tables (if they don't already exist) and seeds
    the default demo dispatcher account.
    Safe to call multiple times — uses CREATE TABLE IF NOT EXISTS.
    """
    ddl = """
        CREATE TABLE IF NOT EXISTS users (
            id               SERIAL PRIMARY KEY,
            username         TEXT UNIQUE NOT NULL,
            password_hash    TEXT NOT NULL,
            created_at       TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS shipments (
            id               SERIAL PRIMARY KEY,
            shipment_id      TEXT UNIQUE NOT NULL,
            origin           TEXT NOT NULL,
            destination      TEXT NOT NULL,
            distance         REAL NOT NULL,
            weather          TEXT NOT NULL,
            route_risk       TEXT NOT NULL,
            delivery_status  TEXT NOT NULL,
            delay_days       INTEGER NOT NULL DEFAULT 0,
            created_at       TIMESTAMPTZ DEFAULT NOW(),
            updated_at       TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS predictions (
            id                    SERIAL PRIMARY KEY,
            shipment_id           INTEGER REFERENCES shipments(id) ON DELETE SET NULL,
            predicted_risk        TEXT NOT NULL,
            prediction_confidence REAL DEFAULT NULL,
            created_at            TIMESTAMPTZ DEFAULT NOW()
        );
    """

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(ddl)

        # Seed demo dispatcher account if it doesn't exist
        cur.execute("SELECT id FROM users WHERE username = %s", ('dispatcher',))
        if not cur.fetchone():
            from werkzeug.security import generate_password_hash
            cur.execute(
                "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
                ('dispatcher', generate_password_hash('RouteSense2026!'))
            )
            print("[Database] Seeded demo account → username: 'dispatcher' / password: 'RouteSense2026!'")

        cur.close()
        conn.close()
        print("[Database] Supabase tables initialized successfully.")
        return True

    except Exception as e:
        print(f"[Database] Error initializing Supabase database: {e}")
        return False


if __name__ == '__main__':
    init_db()
