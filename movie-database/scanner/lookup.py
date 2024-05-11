import json
import os
from dotenv import load_dotenv
import aiohttp
import asyncio
import urllib.parse

from database_tuning.db_access import DBAccess

load_dotenv()
MOVIE_DATABASE_URL = os.environ.get('MOVIE_DATABASE_URL')

def lookup(movies_and_series: dict[str, object], db_path: str) -> int:

    db = DBAccess(db_path)
    added_info_count = 0

    ids_to_urls = {}
    urls = set()

    for id, movie in movies_and_series['Movies'].items():
        if db.has_info(id):
            continue
        params = {
            't': movie.name,
            'y': movie.year,
            'type': 'movie',
        }
        url = MOVIE_DATABASE_URL + urllib.parse.urlencode(params)
        urls.add(url)
        ids_to_urls[id] = url
    
    for id, series in movies_and_series['Series'].items():
        if db.has_info(id):
            continue
        params = {
            't': series.name,
            'y': series.start_year,
            'type': 'series',
        }
        url = MOVIE_DATABASE_URL + urllib.parse.urlencode(params)
        urls.add(url)
        ids_to_urls[id] = url
    
    infos = asyncio.run(getInfos(urls))
    urls_to_infos = {url: info for url, info in infos}

    # urls_to_infos = {}
    # with open("infos.json", "r") as f:
    #     urls_to_infos = json.load(f)
    
    for id, url in ids_to_urls.items():
        info = urls_to_infos.get(url)
        if not info:
            continue
        db.insert_info(id, json.dumps(info))
        added_info_count += 1

    return added_info_count

SEMAPHORE = asyncio.Semaphore(10)

async def fetch_info(session: aiohttp.ClientSession, url: str):
    try:
        async with SEMAPHORE:
            async with session.get(url) as response:
                return (url, await response.json())
    except Exception as e:
        print(f"Error fetching info from {url}: {e}")
        return (url, None)

async def getInfos(urls: set[str]) -> dict[str, object]:
    async with aiohttp.ClientSession() as session:
        tasks = [asyncio.ensure_future(fetch_info(session, url)) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)