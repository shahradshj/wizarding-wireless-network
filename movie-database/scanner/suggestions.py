import os
import sys
from openai import AsyncOpenAI
from dotenv import load_dotenv

sys.path.insert(0, '.')
sys.path.insert(0, '..')
sys.path.insert(0, 'movie-database')

from database_tuning.db_access import DBAccess

load_dotenv()
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
MAX_FAVORITES = 10
client = AsyncOpenAI(api_key=OPENAI_API_KEY)

MODEL = "gpt-3.5-turbo"

async def get_suggestions(movies: list[str], series: list[str], favoriteMovies: list[str], favoriteSeries: list[str]) -> list[str]:
    if (not favoriteMovies or len(favoriteMovies) == 0) and (not favoriteSeries or len(favoriteSeries) == 0):
        return []
    messages = [
        {"role": "system", "content": "You are a movies and series suggestion system."},
        {"role": "system", "content": f"Only these movies: {', '.join(movies)} and these series: {', '.join(series)} are available to suggest."},
        {"role": "system", "content": "The user is asking for a suggestion, by giving you a list of movies and series they like."},
        {"role": "system", "content": "Respond with a comma separated list of movies and series names. No other information is needed."},
        {"role": "user", "content": f"I like these movies: {', '.join(favoriteMovies)}, and I like these series: {', '.join(favoriteSeries)}."},
    ]
    try:
        suggestions = await client.chat.completions.create(
            model=MODEL,
            messages=messages,
        )
        print("suggestions response", suggestions.choices[0].message.content)
        return suggestions.choices[0].message.content.split(", ")
    except Exception as e:
        print("Error getting suggestions", e)
        return []

async def find_suggestions_for_user(db_path: str, userId: str):
    suggested_movie_count = 0
    suggested_series_count = 0
    with DBAccess(db_path) as db:
        allMovies = set([movie['name'] for movie in db.get_movies()])
        allSeries = set([series['name'] for series in db.get_series()])
        favorite_movies = set([movie['name'] for movie in db.get_favorite_movies_by_user_id(userId)])
        favorite_series = set([series['name'] for series in db.get_favorite_series_by_user_id(userId)])
        print("userId", userId)
        print("favorited movies", favorite_movies)
        print("favorited series", favorite_series)

        already_suggested = set(db.get_suggestions_by_user_id(userId))

        suggestions = await get_suggestions(list(allMovies), list(allSeries), list(favorite_movies), list(favorite_series))
        print(f"Suggestions: {suggestions}")
        for suggested in suggestions:
            if suggested in allMovies:
                found_movies = db.get_movies_by_name(suggested)
                for movie in found_movies:
                    if movie['id'] in already_suggested:
                        continue
                    db.insert_suggestion(userId, movie['id'])
                    print(f"Inserted suggestion for movie {movie['name']}")
                    suggested_movie_count += 1
            elif suggested in allSeries:
                found_series = db.get_series_by_title(suggested)
                for series in found_series:
                    if series['id'] in already_suggested:
                        continue
                    db.insert_suggestion(userId, series['id'])
                    print(f"Inserted suggestion for series {series['name']}")
                    suggested_series_count += 1

    return (suggested_movie_count, suggested_series_count)

