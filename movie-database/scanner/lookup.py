import json
import os
from dotenv import load_dotenv
import aiohttp
import asyncio
import urllib.parse
from pathlib import Path

from database_tuning.db_access import DBAccess

load_dotenv()
MOVIE_DATABASE_URL = os.environ.get('MOVIE_DATABASE_URL')
POSTER_DIRECTORY = os.environ.get('POSTER_DIRECTORY')
MAX_CONCURRENT_REQUESTS = 10

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
    
    for id, url in ids_to_urls.items():
        info = urls_to_infos.get(url)
        if not info or "Response" not in info or info["Response"] == "False":
            continue
        db.insert_info(id, json.dumps(info))
        added_info_count += 1
        if 'Genre' in info and info['Genre'] and info['Genre'] != 'N/A':
            for genre in info['Genre'].split(','):
                db.insert_genre(genre.strip(), id)

    return added_info_count

def get_posters(db_path: str):
    with DBAccess(db_path) as db:
        infos = db.get_infos()
        posters_urls_to_ids = {}
        current_posters = set([Path(poster).stem for poster in os.listdir(POSTER_DIRECTORY)])

        for id, info in infos.items():
            info_json = json.loads(info)
            if 'Poster' in info_json and id not in current_posters:
                url = info_json['Poster']
                if url == 'N/A':
                    continue
                if url not in posters_urls_to_ids:
                    posters_urls_to_ids[url] = []
                posters_urls_to_ids[url].append(id)    
        downloaded_posters = asyncio.run(download_posters(posters_urls_to_ids))
        return len([url for url, success in downloaded_posters if success])

def prune_posters(db_path: str):
    with DBAccess(db_path) as db:
        removed_posters = 0
        current_posters = [(Path(poster).stem, POSTER_DIRECTORY + f'/{poster}') for poster in os.listdir(POSTER_DIRECTORY)]
        videos = set([id for id, _ in db.get_video_files()])
        for id, path in current_posters:
            if len(id) == 32 and id not in videos:
                os.remove(path)
                removed_posters += 1
        return removed_posters                


async def fetch_info(session: aiohttp.ClientSession, semaphore: asyncio.Semaphore, url: str):
    try:
        async with semaphore:
            async with session.get(url) as response:
                return (url, await response.json())
    except Exception as e:
        print(f"Error fetching info from {url}: {e}")
        return (url, None)

async def getInfos(urls: set[str]) -> dict[str, object]:
    semaphore = asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)
    async with aiohttp.ClientSession() as session:
        tasks = [asyncio.ensure_future(fetch_info(session, semaphore, url)) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)
    
async def download_posters(posters_urls_to_ids: dict[int, list[str]]):
    semaphore = asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)
    async with aiohttp.ClientSession() as session:
        tasks = [asyncio.ensure_future(download_poster(session, semaphore, url, ids)) for url, ids in posters_urls_to_ids.items()]
        return await asyncio.gather(*tasks, return_exceptions=True)
    
async def download_poster(session: aiohttp.ClientSession, semaphore: asyncio.Semaphore, url: str, ids: list[str]):
    try:
        async with semaphore:
            async with session.get(url) as response:
                image = await response.read()
                if response.status == 200:
                    for id in ids:
                        with open(POSTER_DIRECTORY + f'/{id}.jpg', 'wb') as f:
                            f.write(image)
                    return (url, True)
                return (url, False)
    except Exception as e:
        print(f"Error downloading poster from {url}: {e}")
        return (url, False)
    
