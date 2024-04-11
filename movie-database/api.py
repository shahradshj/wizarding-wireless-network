from fastapi import FastAPI
import sqlite3

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/movies")
def read_movies():
    print("Reading movies")
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT * FROM movies')
    return c.fetchall()

@app.get("/series")
def read_series():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT * FROM series')
    return c.fetchall()

@app.get("/series/{series_id}")
def read_series(series_id: int):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT * FROM series WHERE id = ?', (series_id,))
    return c.fetchone()

from scanner.scan import scan
@app.get("/scan")
def scan_dir():
    return scan()
