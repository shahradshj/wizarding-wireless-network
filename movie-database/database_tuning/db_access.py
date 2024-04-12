import sqlite3
import uuid

class DBAccess:
    """
    A class that provides access to the movie database.

    Attributes:
        conn (sqlite3.Connection): The connection to the SQLite database.
        c (sqlite3.Cursor): The cursor object for executing SQL queries.
    """

    def __init__(self, db_path='movie-database/database.db'):
        """
        Initializes a new instance of the DBAccess class.

        Args:
            db_path (str): The path to the SQLite database file.
        """
        self.conn = sqlite3.connect(db_path)
        self.conn.execute("PRAGMA foreign_keys = ON")
        self.c = self.conn.cursor()

    def __enter__(self):
        return self

    # Video Files
    def insert_video_file(self, path):
        id = uuid.uuid4().hex
        self.c.execute('INSERT INTO video_files (id, path) VALUES (?, ?)', (id, path))
        self.conn.commit()
        return id

    def get_video_files(self):
        self.c.execute('SELECT * FROM video_files')
        return self.c.fetchall()
    
    def get_video_file(self, id):
        self.c.execute('SELECT * FROM video_files WHERE id = ?', (id,))
        return self.c.fetchone()
    
    def get_vidoe_file_by_path(self, path):
        self.c.execute('SELECT * FROM video_files WHERE path = ?', (path,))
        return self.c.fetchone()
    
    def delete_video_file(self, id):
        self.c.execute('DELETE FROM video_files WHERE id = ?', (id,))
        self.conn.commit()

    # Movies
    def insert_movie(self, title, year, video_file_id):
        self.c.execute('INSERT INTO movies (id, title, year) VALUES (?, ?, ?)', (video_file_id, title, year))
        self.conn.commit()
        return video_file_id

    def insert_movie_by_path(self, title, year, path):
        video_file_id = self.insert_video_file(path)
        self.insert_movie(title, year, video_file_id)
        return video_file_id

    def get_movies(self):
        self.c.execute('SELECT * FROM movies')
        return [{"id": movie[0], "name": movie[1], "year": movie[2]} for movie in self.c.fetchall()]
    
    def get_movie(self, id):
        self.c.execute('SELECT * FROM movies WHERE id = ?', (id,))
        movie = self.c.fetchone()
        return {"id": movie[0], "name": movie[1], "year": movie[2]}
    
    def get_movie_by_title_and_year(self, title, year):
        self.c.execute('SELECT * FROM movies WHERE title = ? AND year = ?', (title, year))
        movie = self.c.fetchone()
        return {"id": movie[0], "name": movie[1], "year": movie[2]}
    
    def get_movies_by_name(self, title):
        self.c.execute('SELECT * FROM movies WHERE title = ?', (title,))
        
        return [{"id": movie[0], "name": movie[1], "year": movie[2]} for movie in self.c.fetchall()]
    
    def delete_movie(self, id):
        self.c.execute('DELETE FROM movies WHERE id = ?', (id,))
        self.c.execute('DELETE FROM video_files WHERE id = ?', (id,))
        self.conn.commit()

    # Series
    def insert_series(self, title, start_year, end_year, video_file_id):
        self.c.execute('INSERT INTO series (id, title, start_year, end_year) VALUES (?, ?, ?, ?)', (video_file_id, title, start_year, end_year))
        self.conn.commit()
        return video_file_id

    def insert_series_by_path(self, title, start_year, end_year, path):
        video_file_id = self.insert_video_file(path)
        self.insert_series(title, start_year, end_year, video_file_id)
        return video_file_id

    def get_series(self):
        self.c.execute('SELECT * FROM series')
        return [{"id": series[0], "name": series[1], "start year": series[2], "end year": series[3]} for series in self.c.fetchall()]
    
    def get_series_by_id(self, id):
        self.c.execute('SELECT * FROM series WHERE id = ?', (id,))
        series = self.c.fetchone()
        if series is None:
            return None
        return {"id": series[0], "name": series[1], "start year": series[2], "end year": series[3], "episodes": self.get_episodes_by_series_id(series[0])}

    def get_series_by_title(self, title):
        self.c.execute('SELECT * FROM series WHERE title = ?', (title,))
        return [{"id": series[0],
                 "name": series[1],
                 "start year": series[2],
                 "end year": series[3],
                 "episodes": self.get_episodes_by_series_id(series[0])}
                 for series in self.c.fetchall()]
    
    def get_series_by_title_and_year(self, title, start_year, end_year):
        self.c.execute('SELECT * FROM series WHERE title = ? AND start_year = ? AND end_year = ?', (title, start_year, end_year))
        series = self.c.fetchone()
        return {"id": series[0], "name": series[1], "start year": series[2], "end year": series[3], "episodes": self.get_episodes_by_series_id(series[0])}
    
    def delete_series(self, id):
        self.c.execute('DELETE FROM series WHERE id = ?', (id,))
        self.conn.commit()


    # Episodes
    def insert_episode(self, video_file_id: int, season: int, episode: int, series_id: int):
        self.c.execute('INSERT INTO episodes (id, season, episode, series_id) VALUES (?, ?, ?, ?)', (video_file_id, season, episode, series_id))
        self.conn.commit()
        return video_file_id

    def insert_episode_by_path(self, path: str, season: int, episode: int, series_id: int):
        video_file_id = self.insert_video_file(path)
        self.insert_episode(video_file_id, season, episode, series_id)
        return video_file_id
    
    def get_episodes(self):
        self.c.execute('SELECT * FROM episodes')
        return [{"id": episode[0], "season": episode[1], "episode": episode[2], "series_id": episode[3]} for episode in self.c.fetchall()]
    
    def get_episodes_by_series_id(self, series_id):
        self.c.execute('SELECT * FROM episodes WHERE series_id = ?', (series_id,))
        return [{"id": episode[0], "season": episode[1], "episode": episode[2], "series_id": episode[3]} for episode in self.c.fetchall()]
    
    def get_episodes_by_series_id_and_season(self, series_id, season):
        self.c.execute('SELECT * FROM episodes WHERE series_id = ? AND season = ?', (series_id, season))
        return [{"id": episode[0], "season": episode[1], "episode": episode[2], "series_id": episode[3]} for episode in self.c.fetchall()]
    
    def get_episodes_by_series_id_and_season_and_episode(self, series_id, season, episode):
        self.c.execute('SELECT * FROM episodes WHERE series_id = ? AND season = ? AND episode = ?', (series_id, season, episode))
        episode = self.c.fetchone()
        return {"id": episode[0], "season": episode[1], "episode": episode[2], "series_id": episode[3]}
    
    def get_episode(self, id):
        self.c.execute('SELECT * FROM episodes WHERE id = ?', (id,))
        episode = self.c.fetchone()
        return {"id": episode[0], "season": episode[1], "episode": episode[2], "series_id": episode[3]}
    
    def delete_episode(self, id):
        self.c.execute('DELETE FROM episodes WHERE id = ?', (id,))
        self.conn.commit()


    def close(self):
        """
        Closes the connection to the database.
        """
        self.conn.close()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

