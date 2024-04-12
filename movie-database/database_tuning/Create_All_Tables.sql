-- @block drop all tables
-- Drop all tables if they exist
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS episodes;
DROP TABLE IF EXISTS series;
DROP TABLE IF EXISTS video_files;


-- @block create all tables
-- Enable foreign key constraints
PRAGMA foreign_keys = ON;
-- Create the video_files table
CREATE TABLE video_files
(
    id VARCHAR(32) PRIMARY KEY, -- The unique identifier for each video file as a 32 character string of hexadecimal digits, use varchar(32) incase database changes
    path TEXT -- The path of the video file
);

-- Create the movies table
CREATE TABLE movies (
    id VARCHAR(32) PRIMARY KEY, -- The unique identifier for each movie
    title TEXT, -- The title of the movie
    year INTEGER, -- The year the movie was released
    FOREIGN KEY (id) REFERENCES video_files(id) ON DELETE CASCADE -- The foreign key that references the id column in the video_files table. If a row in the video_files table is deleted, the corresponding row in the movies table will also be deleted.
);

-- Create the series table
CREATE TABLE series (
    id VARCHAR(32) PRIMARY KEY,
    title TEXT,
    start_year INTEGER,
    end_year INTEGER,
    FOREIGN KEY (id) REFERENCES video_files(id) ON DELETE CASCADE
);

-- Create the episodes table
CREATE TABLE episodes (
    id VARCHAR(32) PRIMARY KEY,
    season INTEGER,
    episode INTEGER,
    series_id INTEGER,
    FOREIGN KEY (id) REFERENCES video_files(id) ON DELETE CASCADE,
    FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE
);

