from fastapi import FastAPI, HTTPException
import uvicorn

from database_tuning.db_access import DBAccess
from scanner.scan import scan, prune
from scanner.suggestions import find_suggestions_for_user


app = FastAPI()
db_path = 'movie-database\\database.db'

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/movies")
def read_movies():
    movies = []
    with DBAccess(db_path=db_path) as db:
        movies = db.get_movies()
    return {'movies': movies}


@app.get("/series")
def read_series():
    series = []
    with DBAccess(db_path) as db:
        series = db.get_series()
    return {'series': series}


@app.get("/series/{series_id}")
def read_series(series_id: str):
    series = {}
    with DBAccess(db_path) as db:
        series = db.get_series_by_id(series_id)
    if not series:
        raise HTTPException(status_code=404, detail="Series not found")
    return series


@app.get("/episodes")
def read_episodes():
    episodes = []
    with DBAccess(db_path) as db:
        episodes = db.get_episodes()
    return {'episodes': episodes}


@app.get("/scan")
def scan_dir(lookup: bool = False):
    return scan(do_lookup=lookup)


@app.get("/prune")
def prune_db():
    return {"Pruned": prune()}


# getting video files is only for debugging purposes
@app.get("/videos")
def get_videos():
    with DBAccess(db_path) as db:
        videos = db.get_video_files()
    return [f"{v[0]}: {v[1]}" for v in sorted(videos, key=lambda x: x[1])]

@app.get("/scanForSuggestions")
async def get_suggestions():
    added_movie_suggestions = 0
    added_series_suggestions = 0
    userIds = []
    with DBAccess(db_path) as db:
        userIds = db.get_users()
    for userId in userIds:
        movie_count, series_count = await find_suggestions_for_user(db_path, userId)
        added_movie_suggestions += movie_count
        added_series_suggestions += series_count

    return {"added_movie_suggestions": added_movie_suggestions, "added_series_suggestions": added_series_suggestions}

@app.get("/scanForSuggestions/{userId}")
async def get_suggestions_for_user(userId):
    added_movie_suggestions, added_series_suggestions = await find_suggestions_for_user(db_path, userId)

    return {"added_movie_suggestions": added_movie_suggestions, "added_series_suggestions": added_series_suggestions}


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
