extern crate rusqlite;
use rocket::serde::Serialize;
use rusqlite::{params, Connection};

#[derive(Debug, Serialize)]
pub struct Movie {
    pub id: String,
    pub title: String,
    pub year: i32,
}

#[derive(Debug, Serialize)]
pub struct Series {
    pub id: String,
    pub title: String,
    pub start_year: i32,
    pub end_year: i32,
    pub seasons: Vec<Season>,
}

#[derive(Debug, Serialize)]
pub struct Season {
    pub season: i32,
    pub episodes: Vec<Episode>,
}

#[derive(Debug, Serialize)]
pub struct Episode {
    pub id: String,
    pub season: i32,
    pub episode: i32,
}

pub fn get_movies_from_db(database_path: &str) -> Vec<Movie> {
    let conn = Connection::open(database_path).unwrap();
    let mut stmt = conn.prepare("SELECT id, title, year FROM movies").unwrap();
    let movies_iter = stmt
        .query_map(params![], |row| {
            Ok(Movie {
                id: row.get(0)?,
                title: row.get(1)?,
                year: row.get(2)?,
            })
        })
        .unwrap();

    let mut movies = Vec::new();
    for movie in movies_iter {
        movies.push(movie.unwrap());
    }

    movies
}

pub fn get_series_from_db(database_path: &str) -> Vec<Series> {
    let conn = Connection::open(database_path).unwrap();
    let mut stmt = conn
        .prepare("SELECT id, title, start_year, end_year FROM series")
        .unwrap();
    let series_iter = stmt
        .query_map(params![], |row| {
            Ok(Series {
                id: row.get(0)?,
                title: row.get(1)?,
                start_year: row.get(2)?,
                end_year: row.get(3)?,
                seasons: Vec::new(),
            })
        })
        .unwrap();

    let mut series = Vec::new();
    for serie in series_iter {
        series.push(serie.unwrap());
    }

    series
}

pub fn get_series_seasons_from_db(database_path: &str, series_id: &str) -> Series {
    let conn = Connection::open(database_path).unwrap();
    // Fetch episodes
    let mut stmt = conn
        .prepare("SELECT id, season, episode FROM episodes WHERE series_id = ?1")
        .unwrap();
    let episodes_iter = stmt
        .query_map(params![series_id], |row| {
            Ok(Episode {
                id: row.get(0)?,
                season: row.get(1)?,
                episode: row.get(2)?,
            })
        })
        .unwrap();

    // Create seasons and attach episodes
    let mut seasons: Vec<Season> = Vec::new();
    for episode in episodes_iter {
        let episode = episode.unwrap();

        let season = seasons.iter_mut().find(|s| s.season == episode.season);
        match season {
            Some(season) => season.episodes.push(episode),
            None => {
                seasons.push(Season {
                    season: episode.season,
                    episodes: vec![episode],
                });
            }
        }
    }

    let mut stmt = conn
        .prepare("SELECT id, title, start_year, end_year FROM series WHERE id = ?1")
        .unwrap();
    let series = stmt
        .query_row(params![series_id], |row| {
            Ok(Series {
                id: row.get(0)?,
                title: row.get(1)?,
                start_year: row.get(2)?,
                end_year: row.get(3)?,
                seasons: seasons,
            })
        })
        .unwrap();

    series
}

pub fn get_video_path(database_path: &str, id: &str) -> String {
    let conn = Connection::open(database_path).unwrap();
    let mut stmt = conn
        .prepare("SELECT path FROM video_files WHERE id = ?1")
        .unwrap();
    let path = stmt.query_row(params![id], |row| Ok(row.get(0).unwrap())).unwrap();
    path
}
