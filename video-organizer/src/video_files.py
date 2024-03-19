import os
import re

class VideoFiles:
    """
    A class that represents a collection of video files in a directory.

    Attributes:
        path (str): The path to the directory containing the video files.
        video_formats (list): A list of supported video file formats.
        movies_regex (Pattern): A regular expression pattern for matching movie file names.
        movies_name_group (int): The group index for the movie name in the regex pattern.
        movies_year_group (int): The group index for the movie year in the regex pattern.
        series_regex (Pattern): A regular expression pattern for matching TV series file names.
        series_name_group (int): The group index for the series name in the regex pattern.
        series_season_group (int): The group index for the series season in the regex pattern.
        series_episode_group (int): The group index for the series episode in the regex pattern.
        video_files (list): A list of video files in the directory.
        parsed_video_files (list): A list of parsed video files with their corresponding paths.

    Methods:
        is_video_file(file): Checks if a file is a video file based on its extension.
        get_video_files(): Retrieves a list of video files in the directory.
        parse_video_file(video_file): Parses the video file name and returns the corresponding path.
        parse_video_files(): Parses all video files in the directory and returns a list of parsed files.
        organize_files(): Moves the video files to their corresponding paths based on the parsing results.
        revert_changes(): Reverts the moved video files to their original paths.
    """

    def __init__(self, dirPath):
        self.path = dirPath
        self.video_formats = ['.mp4', '.mkv', '.avi', '.flv', '.ts']

        self.movies_regex = re.compile(r'(.*)_(\d{4})_.*')
        self.movies_name_group = 1
        self.movies_year_group = 2
        self.series_regex = re.compile(r'(.*)_S(\d{1,2})E(\d{1,2})')
        self.series_name_group = 1
        self.series_season_group = 2
        self.series_episode_group = 3

        self.video_files = self.get_video_files()
        self.parsed_video_files = self.parse_video_files()

    def is_video_file(self, file):
        """
        Checks if a file is a video file based on its extension.

        Args:
            file (str): The name of the file.

        Returns:
            bool: True if the file is a video file, False otherwise.
        """
        _, ext = os.path.splitext(file)
        return ext in self.video_formats

    def get_video_files(self):
        """
        Retrieves a list of video files in the directory.

        Returns:
            list: A list of video file names.
        """
        return [file for file in os.listdir(self.path) if self.is_video_file(file)]
    
    def parse_video_file(self, video_file):
        """
        Parses the video file name and returns the corresponding path.

        Args:
            video_file (str): The name of the video file.

        Returns:
            str: The parsed path of the video file.
        """
        match = self.series_regex.search(video_file)
        if match:
            name = match.group(self.series_name_group).replace('_', ' ')
            name.replace(' s ', "'s ")
            season = int(match.group(self.series_season_group))
            return os.path.join('Series', f'{name} ( - )', f'Season {season}', video_file)
        else:
            match = self.movies_regex.search(video_file)
            if match:
                name = match.group(self.movies_name_group).replace('_', ' ')
                name.replace(' s ', "'s ")
                year = match.group(self.movies_year_group)
                return os.path.join('Movies', f'{name} ({year})', video_file)

        return None

    def parse_video_files(self):
        """
        Parses all video files in the directory and returns a list of parsed files.

        Returns:
            list: A list of tuples containing the original video file name and its parsed path.
        """
        return [(file, self.parse_video_file(file)) for file in self.video_files]
    
    def organize_files(self):
        """
        Moves the video files to their corresponding paths based on the parsing results.
        """
        for file, parsed_path in self.parsed_video_files:
            if parsed_path:
                src = os.path.join(self.path, file)
                dest = os.path.join(self.path, parsed_path)
                if not os.path.exists(dest):
                    # print(f'Moving {src} to {dest}')
                    os.renames(src, dest)
    
    def revert_changes(self):
        """
        Reverts the moved video files to their original paths.
        """
        for file, parsed_path in self.parsed_video_files:
            if parsed_path:
                src = os.path.join(self.path, parsed_path)
                dest = os.path.join(self.path, file)
                if not os.path.exists(dest):
                    # print(f'Moving {src} to {dest}')
                    os.renames(src, dest)

