import sqlite3

conn = sqlite3.connect('movie-database/database.db')

c = conn.cursor()

# Read SQL file
with open('Creat_Video_File_Tables.sql', 'r') as sql_file:
    sql_script = sql_file.read()

# Execute SQL script
c.executescript(sql_script)

conn.commit()
conn.close()
