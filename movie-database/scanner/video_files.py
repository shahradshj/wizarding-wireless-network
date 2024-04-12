import os
import glob
import re
from collections import namedtuple

Movie = namedtuple('Movie', ['name', 'year', 'path'])
Episode = namedtuple('Episode', ['name', 'season', 'episode', 'path'])
Series = namedtuple('Series', ['name', 'start_year', 'end_year', 'dir_path'])

class VideoFiles:
    """A class to parse video files into movies and series."""

    def __init__(self, directory):
        self.directory = directory
        self.extensions = ['.mp4', '.mkv', '.avi', '.flv', '.ts']
        self.movie_regex = re.compile(r'(.*)_(\d{4})_.*')  # Precompile the regex
        self.group_of_movie_name = 1
        self.group_of_movie_year = 2

        self.series_regex = re.compile(r'(.*) \((\d{4}) - (\d{4})?\)')
        self.group_of_series_name = 1
        self.group_of_series_start_year = 2
        self.group_of_series_end_year = 3

        self.episode_regex = re.compile(r'(.*)_S(\d{1,2})E(\d{1,2})')  # Precompile the regex
        self.group_of_episode_season = 2
        self.group_of_episode_episode = 3
    
    def all_files(self):
        """Return all files in the directory."""
        return glob.glob(os.path.join(self.directory, '**'), recursive=True)

    def parse_movies_and_series(self):
        """Parse movies and series from the directory."""
        movies_and_series = {"Movies": [], "Series": {}}
        for file_path in glob.glob(os.path.join(self.directory, '**', '*.*'), recursive=True):
            if self.is_movie_file(file_path):
                movie = self.parse_movie_name(file_path)
                if movie:
                    movies_and_series['Movies'].append(movie)
            elif self.is_episode_file(file_path):
                series, episode = self.parse_episode_name(file_path)
                if series:
                    if series not in movies_and_series['Series']:
                        movies_and_series['Series'][series] = []
                    movies_and_series['Series'][series].append(episode)
        return movies_and_series

    def parse_movie_name(self, path):
        """Parse movie name from the file path."""
        name = os.path.basename(path)
        movie_match = self.movie_regex.match(name)  # Use precompiled regex
        if movie_match:
            movie_name = movie_match.group(self.group_of_movie_name).replace("_", " ").strip()
            year = int(movie_match.group(self.group_of_movie_year))
            return Movie(movie_name, year, path)
        return None

    def parse_episode_name(self, path):
        """Parse series name from the file path."""
        name = os.path.basename(path)
        episode_match = self.episode_regex.match(name)  # Use precompiled regex
        if episode_match:
            season = int(episode_match.group(self.group_of_episode_season))
            episode = int(episode_match.group(self.group_of_episode_episode))
            series_dir = os.path.dirname(os.path.dirname(path))

            series_match = re.match(self.series_regex, os.path.basename(series_dir))  # Use precompiled regex
            if series_match:
                series_name = series_match.group(self.group_of_series_name)
                startYear = int(series_match.group(self.group_of_series_start_year))
                endYear = int(series_match.group(self.group_of_series_end_year)) if series_match.group(self.group_of_series_end_year) else 0
                return (Series(series_name, startYear, endYear, series_dir), Episode(series_name, season, episode, path))
        return (None, None)

    def is_video_file(self, path):
        """Check if the file is a video file."""
        _, ext = os.path.splitext(path)
        return ext in self.extensions  # Compare with the period included

    def is_movie_file(self, path):
        """Check if the file is a movie file."""
        if not self.is_video_file(path):
            return False
        episode_match = self.episode_regex.match(path)
        movie_match = self.movie_regex.match(path)
        return episode_match is None and movie_match is not None

    def is_episode_file(self, path):
        """Check if the file is a series file."""
        if not self.is_video_file(path):
            return False
        episode_match = self.episode_regex.match(path)
        return episode_match is not None
    