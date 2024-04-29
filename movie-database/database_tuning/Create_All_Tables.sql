-- @block drop video_files table
-- Drop the video_files table if it exists
DROP TABLE IF EXISTS video_files;

-- @block drop movies table
-- Drop the movies table if it exists
DROP TABLE IF EXISTS movies;

-- @block drop series table
-- Drop the series table if it exists
DROP TABLE IF EXISTS series;

-- @block drop episodes table
-- Drop the episodes table if it exists
DROP TABLE IF EXISTS episodes;

-- @block drop users table
-- Drop the users table if it exists
DROP TABLE IF EXISTS users;

-- @block drop watch_history table
-- Drop the watch_history table if it exists
DROP TABLE IF EXISTS watch_history;

-- @block enable foreign key constraints
-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- @block create video_files table
-- Enable foreign key constraints
PRAGMA foreign_keys = ON;
-- Create the video_files table
CREATE TABLE video_files (
    id VARCHAR(32) PRIMARY KEY,
    path TEXT -- The path of the video file
);

-- @block create movies table
-- Enable foreign key constraints
PRAGMA foreign_keys = ON;
-- Create the movies table
CREATE TABLE movies (
    id VARCHAR(32) PRIMARY KEY,
    title TEXT,
    year INTEGER,
    FOREIGN KEY (id) REFERENCES video_files(id) ON DELETE CASCADE
);

-- @block create series table
-- Enable foreign key constraints
PRAGMA foreign_keys = ON;
-- Create the series table
CREATE TABLE series (
    id VARCHAR(32) PRIMARY KEY,
    title TEXT,
    start_year INTEGER,
    end_year INTEGER,
    FOREIGN KEY (id) REFERENCES video_files(id) ON DELETE CASCADE
);

-- @block create episodes table
-- Enable foreign key constraints
PRAGMA foreign_keys = ON;
-- Create the episodes table
CREATE TABLE episodes (
    id VARCHAR(32) PRIMARY KEY,
    season INTEGER,
    episode INTEGER,
    series_id INTEGER,
    FOREIGN KEY (id) REFERENCES video_files(id) ON DELETE CASCADE,
    FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE
);

-- @block create users table
-- Enable foreign key constraints
PRAGMA foreign_keys = ON;
-- Create the users table
CREATE TABLE users (
    id varchar(32) PRIMARY KEY,
    username TEXT UNIQUE
);

-- @block create watch_history table
-- Enable foreign key constraints
PRAGMA foreign_keys = ON;
-- Create the watch_history table
CREATE TABLE watch_history (
    user_id VARCHAR(32),
    video_id VARCHAR(32),
    timestamp INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (video_id) REFERENCES video_files(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, video_id)
);
