# Wizarding Wireless Network

## Description

This project is a home media server. It allows you to organize and stream your personal collection of movies and series.

My aim is to always keep the original quality of the video files. I would rather not watch anything than drop the quality.

### Video Organizer

It organizes movies and series with '_' separated names. For example:
- 'Pirates_of_the_Caribbean_The_Curse_of_the_Black_Pearl_2003_10bit_HDR_2160p_x265_BluRay_DTS-HD.mkv' to 'Pirates of the Caribbean the Curse of the Black Pearl (2003)/Pirates_of_the_Caribbean_The_Curse_of_the_Black_Pearl_2003_10bit_HDR_2160p_x265_BluRay_DTS-HD.mkv'
- 'The_Grand_Tour_S05E02_10bit_HDR10Plus_x265_2160p_WEBRip_6CH.mkv' to 'The Grand Tour ( - )/Season 5/The_Grand_Tour_S05E02_10bit_HDR10Plus_x265_2160p_WEBRip_6CH.mkv' 

### Movie Database

It stores movies, series, episodes, and video files in a SQLite database.
It also has an API for scanning, pruning, and getting movies and series.

### Streaming API

It has get movies and series endpoints from the movie-database endpoint in addition to a get video endpoint which streams the video file associated with the id provided by finding its path in the video_files table.
