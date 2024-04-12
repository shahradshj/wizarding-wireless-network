import sqlite3

conn = sqlite3.connect('movie-database/database.db')
c = conn.cursor()

# Read SQL file
with open('/c:/Software Development/wizarding-wireless-network/movie-database/database_tuning/Creat_Series_Table.sql', 'r') as sql_file:
    sql_script = sql_file.read()

# Execute SQL script
c.executescript(sql_script)


conn.commit()
conn.close
