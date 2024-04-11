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
    return [{"id": movie[0], "name": movie[1], "year": movie[2]} for movie in c.fetchall()]

@app.get("/series")
def read_series():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT * FROM series')
    return [{"id": series[0], "name": series[1], "start year": series[2], "end year": series[3]} for series in c.fetchall()]

@app.get("/series/{series_id}")
def read_series(series_id: str):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('SELECT * FROM series WHERE id = ?', (series_id,))
    series = c.fetchone()
    series = {"id": series[0], "name": series[1], "start year": series[2], "end year": series[3]}
    c.execute('SELECT * FROM episodes WHERE series_id = ?', (series_id,))
    episodes = c.fetchall()
    episodes.sort(key=lambda x: (x[1], x[2]))
    series["episodes"] = [{"id": episode[0], "season": episode[1], "episode": episode[2]} for episode in episodes]
    return series

from scanner.scan import scan
@app.get("/scan")
def scan_dir():
    return scan(db_path='database.db')
