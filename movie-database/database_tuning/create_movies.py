import sqlite3

conn = sqlite3.connect('movie-database/database.db')
c = conn.cursor()

# Open and read the SQL file
with open('Creat_Movies_Table.sql', 'r') as sql_file:
    sql_script = sql_file.read()

# Execute the SQL script
c.executescript(sql_script)

# Drop the table if it already exists
c.execute('DROP TABLE IF EXISTS movies')

conn.commit()
conn.close