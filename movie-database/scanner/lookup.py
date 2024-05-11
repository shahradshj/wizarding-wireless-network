import os
from dotenv import load_dotenv
import requests
import urllib.parse

from database_tuning.db_access import DBAccess

load_dotenv()
MOVIE_DATABASE_URL = os.environ.get('MOVIE_DATABASE_URL')

def lookup(movies_and_series: dict[str, object], db_path: str) -> int:

    db = DBAccess(db_path)
    added_info_count = 0

    ids_to_urls = {}
    urls_to_jsons = {}

    for id, movie in movies_and_series['Movies'].items():
        params = {
            't': movie.name,
            'y': movie.year,
            'type': 'movie',
        }
        url = MOVIE_DATABASE_URL + urllib.parse.urlencode(params)
        urls_to_jsons[url] = None
        ids_to_urls[id] = url
    
    for id, series in movies_and_series['Series'].items():
        params = {
            't': series.name,
            'y': series.start_year,
            'type': 'series',
        }
        url = MOVIE_DATABASE_URL + urllib.parse.urlencode(params)
        urls_to_jsons[url] = None
        ids_to_urls[id] = url
    
    print(ids_to_urls)

    return added_info_count