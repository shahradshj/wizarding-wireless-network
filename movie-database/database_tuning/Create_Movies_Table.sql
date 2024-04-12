-- This script creates a new table called movies. The movies table has three columns: id, title, and year. The id column is a foreign key that references the id column in the video_files table. The title column stores the title of the movie, and the year column stores the year the movie was released. The script also includes a SELECT statement to retrieve all the rows from the movies table. The SELECT statement is commented out because the movies table is empty at this point. You can uncomment the SELECT statement and run the script to see the empty movies table.

-- @block: Drop_Movies_Table
-- Drop the movies table if it exists
DROP TABLE IF EXISTS movies;

-- @block: Create_Movies_Table
-- Create the movies table
CREATE TABLE movies (
    id VARCHAR(32) PRIMARY KEY, -- The unique identifier for each movie
    title TEXT, -- The title of the movie
    year INTEGER, -- The year the movie was released
    FOREIGN KEY (id) REFERENCES video_files(id) ON DELETE CASCADE -- The foreign key that references the id column in the video_files table. If a row in the video_files table is deleted, the corresponding row in the movies table will also be deleted.
)

-- @block: Select_All_Rows_From_Movies_Table
-- Select all rows from the movies table
SELECT * FROM movies;
