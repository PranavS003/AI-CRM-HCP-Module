import json
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "crm.db"


def normalize(value):
    """
    Convert complex Python objects into SQLite-friendly strings.
    """

    if value is None:
        return ""

    if isinstance(value, list):
        return ", ".join(str(item) for item in value)

    if isinstance(value, dict):
        return json.dumps(value)

    return str(value)


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            doctor_name TEXT,
            hospital TEXT,
            meeting_type TEXT,
            product TEXT,
            sentiment TEXT,
            materials_shared TEXT,
            follow_up TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    conn.commit()
    conn.close()


def save_interaction(data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO interactions
        (
            doctor_name,
            hospital,
            meeting_type,
            product,
            sentiment,
            materials_shared,
            follow_up
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            normalize(data.get("doctor_name")),
            normalize(data.get("hospital")),
            normalize(data.get("meeting_type")),
            normalize(data.get("product")),
            normalize(data.get("sentiment")),
            normalize(data.get("materials_shared")),
            normalize(data.get("follow_up")),
        ),
    )

    conn.commit()
    interaction_id = cursor.lastrowid
    conn.close()

    return interaction_id


def get_all_interactions():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM interactions
        ORDER BY created_at DESC
        """
    )

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


def get_interaction(interaction_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM interactions
        WHERE id = ?
        """,
        (interaction_id,),
    )

    row = cursor.fetchone()
    conn.close()

    return dict(row) if row else None


def update_interaction(interaction_id: int, data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE interactions
        SET
            doctor_name=?,
            hospital=?,
            meeting_type=?,
            product=?,
            sentiment=?,
            materials_shared=?,
            follow_up=?
        WHERE id=?
        """,
        (
            normalize(data.get("doctor_name")),
            normalize(data.get("hospital")),
            normalize(data.get("meeting_type")),
            normalize(data.get("product")),
            normalize(data.get("sentiment")),
            normalize(data.get("materials_shared")),
            normalize(data.get("follow_up")),
            interaction_id,
        ),
    )

    conn.commit()
    conn.close()


def search_interactions(keyword: str):
    conn = get_connection()
    cursor = conn.cursor()

    like = f"%{keyword}%"

    cursor.execute(
        """
        SELECT *
        FROM interactions
        WHERE
            doctor_name LIKE ?
            OR hospital LIKE ?
            OR meeting_type LIKE ?
            OR product LIKE ?
            OR sentiment LIKE ?
            OR materials_shared LIKE ?
            OR follow_up LIKE ?
        ORDER BY created_at DESC
        """,
        (
            like,
            like,
            like,
            like,
            like,
            like,
            like,
        ),
    )

    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


def delete_interaction(interaction_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        DELETE FROM interactions
        WHERE id = ?
        """,
        (interaction_id,),
    )

    conn.commit()
    conn.close()