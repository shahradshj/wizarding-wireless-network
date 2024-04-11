from fastapi import FastAPI
import sqlite3

from database_tuning.db_access import DBAccess
from scanner.scan import scan, prune


app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/movies")
def read_movies():
    movies = []
    with DBAccess() as db:
        movies = db.get_movies()
    return {'movies': movies}

@app.get("/series")
def read_series():
    series = []
    with DBAccess() as db:
        series = db.get_series()
    return {'series': series}

@app.get("/series/{series_id}")
def read_series(series_id: str):
    series = {}
    with DBAccess() as db:
        series = db.get_series_by_id(series_id)
    return series

@app.get("/scan")
def scan_dir():
    return scan(db_path='database.db')

@app.get("/prune")
def prune_db():
    return {"Pruned": prune(db_path='database.db')}

