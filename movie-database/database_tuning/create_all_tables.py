import sqlite3

conn = sqlite3.connect('movie-database/database.db')
conn.execute("PRAGMA foreign_keys = 1")
c = conn.cursor()

# Read SQL file
with open('movie-database\\database_tuning\\Create_All_Tables.sqlite', 'r') as sql_file:
    sql_script = sql_file.read()

# Execute SQL script
c.executescript(sql_script)

conn.commit()
conn.close()
