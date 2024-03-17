-- This script creates a new table called episodes. The episodes table has four columns: id, season, episode, and series_id. The id column is a foreign key that references the id column in the video_files table. The season column stores the season number, the episode column stores the episode number, and the series_id column stores the id of the series to which the episode belongs. The script also includes a SELECT statement to retrieve all the rows from the episode table. The SELECT statement is commented out because the episode table is empty at this point. You can uncomment the SELECT statement and run the script to see the empty episode table.

-- @block: drop_episodes_table
-- Drop the episodes table if it exists
DROP TABLE IF EXISTS episodes;

-- @block: Create_Episodes_Table
-- Create the episodes table
CREATE TABLE episodes (
    id INTEGER PRIMARY KEY,
    season INTEGER,
    episode INTEGER,
    series_id INTEGER,
    FOREIGN KEY (id) REFERENCES video_files(id),
    FOREIGN KEY (series_id) REFERENCES series(id)
)

-- @block: Select_All_Rows_From_Episode_Table
-- Select all rows from the episode table
SELECT * FROM episode;