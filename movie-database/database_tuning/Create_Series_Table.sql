-- This script creates a new table called series. The series table has four columns: id, title, start_year, and end_year. The id column is a foreign key that references the id column in the video_files table. The title column stores the title of the series, the start_year column stores the year the series started, and the end_year column stores the year the series ended. The script also includes a SELECT statement to retrieve all the rows from the series table. The SELECT statement is commented out because the series table is empty at this point. You can uncomment the SELECT statement and run the script to see the empty series table.

-- @block: drop_series_table
-- Drop the series table if it exists
DROP TABLE IF EXISTS series;

-- @block: Create_Series_Table
-- Create the series table
CREATE TABLE series (
    id INTEGER PRIMARY KEY,
    title TEXT,
    start_year INTEGER,
    end_year INTEGER,
    FOREIGN KEY (id) REFERENCES video_files(id)
)

-- @block: Select_All_Rows_From_Series_Table
-- Select all rows from the series table
SELECT * FROM series;
