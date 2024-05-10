import os
from dotenv import load_dotenv
import urllib.parse, urllib.request

from database_tuning.db_access import DBAccess

load_dotenv()
API_KEY = os.environ.get('OMDB_API_KEY')

def lookup(movies_and_series: dict[str, object], db_path: str) -> int:

    db = DBAccess(db_path)
    added_info_count = 0

    for movie in movies_and_series['Movies']:
        print(f"Looking up {movie.name}")
    
    for series, episodes in movies_and_series['Series'].items():
        print(f"Looking up {series.name}")
        for episode in episodes:
            print(f"Looking up {episode.name}")

    return added_info_count