import sqlite3

conn = sqlite3.connect('movie-database/database.db')

c = conn.cursor()

# Drop the table if it already exists
c.execute('DROP TABLE IF EXISTS video_files')

# Create table
# Create a table called "video_files" with the following columns:
# - id: an integer that represents the primary key
# - path: a string that represents the path to the video file

c.execute('''CREATE TABLE video_files
                (id INTEGER PRIMARY KEY, path TEXT)''')

conn.commit()
conn.close()
