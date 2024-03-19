-- This script drops the existing video_files table if it exists and creates a new one.

-- @block drop_video_files_table
-- Drop the video_files table if it exists
DROP TABLE IF EXISTS video_files;

-- @block Create_Video_Files_Table
-- Create the video_files table
CREATE TABLE video_files
(
    id INTEGER PRIMARY KEY, -- The unique identifier for each video file
    path TEXT -- The path of the video file
);


-- @block
-- Select all rows from the video_files table
SELECT * FROM video_files;
