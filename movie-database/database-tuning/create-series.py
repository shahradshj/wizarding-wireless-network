import sqlite3

conn = sqlite3.connect('movie-database/database.db')
c = conn.cursor()

# Drop the table if it already exists
c.execute('DROP TABLE IF EXISTS series')

# Create a table called "series" with the following columns:
# - id: an integer that represents the primary key
# - id: an integer that represents the foreign key that references the id column in the video_files table
# - title: a string that represents the title of the series
# - start_year: an integer that represents the year the series started
# - end_year: an integer that represents the year the series ended

c.execute('''
    CREATE TABLE series
    (
        id INTEGER PRIMARY KEY,
        title TEXT,
        start_year INTEGER,
        end_year INTEGER,
        FOREIGN KEY (id) REFERENCES video_files(id)
    )
''')

conn.commit()
conn.close
