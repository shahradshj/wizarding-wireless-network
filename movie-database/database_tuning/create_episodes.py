import sqlite3

conn = sqlite3.connect('movie-database/database.db')
c = conn.cursor()

# Drop the table if it already exists
c.execute('DROP TABLE IF EXISTS episodes')

# Create table
# Create a table called "episodes" with the following columns:
# - id: an integer that represents the primary key
# - series_id: an integer that represents the foreign key to the series table
# - season: an integer that represents the season number
# - episode: an integer that represents the episode number

c.execute('''
    CREATE TABLE episodes
    (
        id INTEGER PRIMARY KEY,
        series_id INTEGER,
        season INTEGER,
        episode INTEGER,
        FOREIGN KEY (id) REFERENCES video_files(id),
        FOREIGN KEY (series_id) REFERENCES series(id)
    )
''')

conn.commit()
conn.close
