import sqlite3

conn = sqlite3.connect('movie-database/database.db')
c = conn.cursor()

# Drop the table if it already exists
c.execute('DROP TABLE IF EXISTS movies')


# Create a table called "movies" with the following columns:
# - id: an integer that represents the primary key
# - id: an integer that represents the foreign key that references the id column in the video_files table
# - title: a string that represents the title of the movie
# - year: an integer that represents the year the movie was released
c.execute('''
    CREATE TABLE movies
    (
        id INTEGER PRIMARY KEY,
        title TEXT,
        year INTEGER,
        FOREIGN KEY (id) REFERENCES video_files(id)
    )
''')

conn.commit()
conn.close