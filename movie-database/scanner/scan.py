import sys

from video_files import VideoFiles

sys.path.insert(0, 'movie-database')
from database_tuning.db_access import DBAccess


def scan(directory: str = 'D:\Movies & Series') -> None:
    video_files = VideoFiles(directory)
    movies_and_series = video_files.parse_movies_and_series()

    db = DBAccess()

    insertCount = 0
    skipCount = 0
    for movie in movies_and_series['Movies']:
        try:
            if not db.get_vidoe_file_by_path(movie.path):
                db.insert_movie_by_path(movie.name, movie.year, movie.path)
                insertCount += 1
            else:
                skipCount += 1
        except Exception as e:
            print(f"Error inserting movie {movie.name}: {e}")
    print(f"Inserted {insertCount} movies out of {len(movies_and_series['Movies'])} movies. Skipped {skipCount} movies. Failed to insert {len(movies_and_series['Movies']) - insertCount - skipCount} movies.")

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

if __name__ == '__main__':
    scan()