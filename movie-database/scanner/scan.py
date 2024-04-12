import os
import sys

sys.path.insert(0, '.')
sys.path.insert(0, '..')
sys.path.insert(0, 'movie-database')

from scanner.video_files import VideoFiles
from database_tuning.db_access import DBAccess


def scan(directory: str = 'D:\Movies & Series', db_path='movie-database/database.db'):
    video_files = VideoFiles(directory)
    movies_and_series = video_files.parse_movies_and_series()

    db = DBAccess(db_path)

    insertMoviesCount = 0
    skipCount = 0
    for movie in movies_and_series['Movies']:
        try:
            if not db.get_vidoe_file_by_path(movie.path):
                db.insert_movie_by_path(movie.name, movie.year, movie.path)
                insertMoviesCount += 1
            else:
                skipCount += 1
        except Exception as e:
            print(f"Error inserting movie {movie.name}: {e}")
    print(f"Inserted {insertMoviesCount} movies out of {len(movies_and_series['Movies'])} movies. Skipped {skipCount} movies. Failed to insert {len(movies_and_series['Movies']) - insertMoviesCount - skipCount} movies.")

    insertSeriesCount = 0
    insertEpisodeCount = 0
    skipSeriesCount = 0
    skipEpisodeCount = 0
    totalEpisodes = 0
    for series, episodes in movies_and_series['Series'].items():
        try:
            totalEpisodes += len(episodes)
            if not db.get_vidoe_file_by_path(series.dir_path):
                series_id = db.insert_series_by_path(series.name, series.start_year, series.end_year, series.dir_path)
                insertSeriesCount += 1
            else:
                series_id = db.get_vidoe_file_by_path(series.dir_path)[0]
                skipSeriesCount += 1
            for episode in episodes:
                if not db.get_vidoe_file_by_path(episode.path):
                    db.insert_episode_by_path(episode.path, episode.season, episode.episode, series_id)
                    insertEpisodeCount += 1
                else:
                    skipEpisodeCount += 1
        except Exception as e:
            print(f"Error inserting series {series.name}: {e}")
    print(f"Inserted {insertSeriesCount} series out of {len(movies_and_series['Series'])} series. Skipped {skipSeriesCount} series. Failed to insert {len(movies_and_series['Series']) - insertSeriesCount - skipSeriesCount} series.")
    print(f"Inserted {insertEpisodeCount} episodes out of {totalEpisodes} episodes. Skipped {skipEpisodeCount} episodes. Failed to insert {totalEpisodes - insertEpisodeCount - skipEpisodeCount} episodes.")
            
    db.close()

    return {"Inserted Movies": insertMoviesCount, "Skipped Movies": skipCount, "Inserted Series": insertSeriesCount, "Skipped Series": skipSeriesCount, "Inserted Episodes": insertEpisodeCount, "Skipped Episodes": skipEpisodeCount}


def prune(directory: str = 'D:\Movies & Series', db_path='movie-database/database.db'):
    removed_files = []
    all_files = set(VideoFiles(directory).all_files())
    with DBAccess(db_path) as db:
        videos = db.get_video_files()
        for video in videos:
            if video[1] not in all_files:
                db.delete_video_file(video[0])
                removed_files.append((video[0], "..." + os.path.basename(video[1])))
    print(f"Pruned {len(removed_files)} files.")
    return {"Prune count": len(removed_files), "Removed:": removed_files}

if __name__ == '__main__':
    if len(sys.argv) > 1:
        scan(sys.argv[1])
    else:
        scan()