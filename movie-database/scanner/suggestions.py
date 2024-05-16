import os
import random
import sys
import asyncio
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
SYSTEM_MESSAGES_FOR_MOVIES = [
    {"role": "system", "content": "You are a movies suggestion chatbot."},
    {"role": "system", "content": "You are chatting with a user who is looking for a new movies to watch."},
    {"role": "system", "content": "The user is asking for a suggestion, by giving you a list of movies they like."},
    {"role": "system", "content": "Only responsd with a comma separated name of movies."},
]

SYSTEM_MESSAGES_FOR_SERIES = [
    {"role": "system", "content": "You are a series suggestion chatbot."},
    {"role": "system", "content": "You are chatting with a user who is looking for a new series to watch."},
    {"role": "system", "content": "The user is asking for a suggestion, by giving you a list of series they like."},
    {"role": "system", "content": "Only responsd with a comma separated name of series."},
]

async def get_movie_suggestions(movies: list[str]) -> list[str]:
    if not movies or len(movies) == 0:
        return []
    if len(movies) > MAX_FAVORITES:
        movies = random.sample(movies, MAX_FAVORITES)
    with_user_messages = SYSTEM_MESSAGES_FOR_MOVIES + [{"role": "user", "content": f"I like the movies: {", ".join(movies)}."}]
    try:
        suggestions = await client.chat.completions.create(
            model=MODEL,
            messages=with_user_messages,
        )
        print(suggestions.choices[0].message.content)
        return suggestions.choices[0].message.content.split(", ")
    except Exception as e:
        return []
    
async def get_series_suggestions(series: list[str]) -> list[str]:
    if not series or len(series) == 0:
        return []
    if len(series) > MAX_FAVORITES:
        series = random.sample(series, MAX_FAVORITES)
    with_user_messages = SYSTEM_MESSAGES_FOR_SERIES + [{"role": "user", "content": f"I like the series: {", ".join(series)}."}]
    try:
        suggestions = await client.chat.completions.create(
            model=MODEL,
            messages=with_user_messages,
        )
        return suggestions.choices[0].message.content.split(", ")
    except Exception as e:
        print("Error getting series suggestions", e)
        return []
    
async def find_suggestions_for_user(db_path: str, userId: str):
    suggested_movie_count = 0
    suggested_series_count = 0
    with DBAccess(db_path) as db:
        favorite_movies = set([movie['name'] for movie in db.get_favorite_movies_by_user_id(userId)])
        favorite_series = set([series['name'] for series in db.get_favorite_series_by_user_id(userId)])
        print("userId", userId)
        print("favorited movies", favorite_movies)
        print("favorited series", favorite_series)

        movie_suggestions = await get_movie_suggestions(favorite_movies)
        series_suggestions = await get_series_suggestions(favorite_series)
        print(f"Movie suggestions: {movie_suggestions}")
        print(f"Series suggestions: {series_suggestions}")

        for suggested_movie in movie_suggestions:
            found_movies = db.get_movies_by_name(suggested_movie)
            for movie in found_movies:
                db.insert_suggestion(userId, movie['id'])
                print(f"Inserted suggestion for movie {movie['title']}")
                suggested_movie_count += 1

        for suggested_series in series_suggestions:
            found_seris = db.get_series_by_title(suggested_series)
            for series in found_seris:
                db.insert_suggestion(userId, series['id'])
                print(f"Inserted suggestion for series {series['title']}")
                suggested_series_count += 1

    return (suggested_movie_count, suggested_series_count)

asyncio.run(find_suggestions_for_user("movie-database\database.db", "48d0a67188834bae8cd277781a2988d3"))
