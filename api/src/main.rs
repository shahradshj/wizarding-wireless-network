#[macro_use] extern crate rocket;
extern crate rusqlite;

use rocket::serde::Serialize;
use rocket::serde::json::Json;
use rusqlite::{params, Connection};

const DATABASE_PATH: &str = "../movie-database/database.db";


#[derive(Serialize)]
struct Movie {
    id: String,
    title: String,
    year: i32,
}

#[derive(Serialize)]
struct Series {
    id: String,
    title: String,
    start_year: i32,
    end_year: i32,
    seasons: Vec<Season>,
}

#[derive(Serialize)]
struct Season {
    season: i32,
    episodes: Vec<Episode>,
}

#[derive(Serialize)]
struct Episode {
    id: String,
    season: i32,
    episode: i32,
}

#[get("/movies")]
fn get_movies() -> Json<Vec<Movie>> {
    let conn = Connection::open(DATABASE_PATH).unwrap();
    let mut stmt = conn.prepare("SELECT id, title, year FROM movies").unwrap();
    let movies_iter = stmt.query_map(params![], |row| {
        Ok(Movie {
            id: row.get(0)?,
            title: row.get(1)?,
            year: row.get(2)?,
        })
    }).unwrap();

    let mut movies = Vec::new();
    for movie in movies_iter {
        movies.push(movie.unwrap());
    }

    Json(movies)
}

#[get("/series")]
fn get_series() -> Json<Vec<Series>> {
    let conn = Connection::open(DATABASE_PATH).unwrap();
    let mut stmt = conn.prepare("SELECT id, title, start_year, end_year FROM series").unwrap();
    let series_iter = stmt.query_map(params![], |row| {
        Ok(Series {
            id: row.get(0)?,
            title: row.get(1)?,
            start_year: row.get(2)?,
            end_year: row.get(3)?,
            seasons: Vec::new(),
        })
    }).unwrap();

    let mut series = Vec::new();
    for serie in series_iter {
        series.push(serie.unwrap());
    }

    Json(series)
}

#[get("/series/<id>")]
fn get_series_by_id(id: String) -> Json<Series> {
    let conn = Connection::open(DATABASE_PATH).unwrap();
    print!("Fetching series with id: {}\n", id);
    // Fetch episodes
    let mut stmt = conn.prepare("SELECT id, season, episode FROM episodes WHERE series_id = ?1").unwrap();
    print!("Fetching episodes\n");
    let episodes_iter = stmt.query_map(params![id], |row| {
        Ok(Episode {
            id: row.get(0)?,
            season: row.get(1)?,
            episode: row.get(2)?,
        })
    }).unwrap();
    print!("Episodes fetched\n");

    // Create seasons and attach episodes
    let mut seasons: Vec<Season> = Vec::new();
    for episode in episodes_iter {
        let episode = episode.unwrap();
        print!("season id {:?} episode number {:?} id {:?}\n", episode.season, episode.episode, episode.id);
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
    print!("number of seasons {:?}\n", seasons.len());

    let mut stmt = conn.prepare("SELECT id, title, start_year, end_year FROM series WHERE id = ?1").unwrap();
    let series = stmt.query_row(params![id], |row| {
        Ok(Series {
            id: row.get(0)?,
            title: row.get(1)?,
            start_year: row.get(2)?,
            end_year: row.get(3)?,
            seasons: seasons,
        })
    }).unwrap();
    print!("series id {:?} title {:?} start year {:?} end year {:?}\n", series.id, series.title, series.start_year, series.end_year);

    Json(series)
}


#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![get_movies, get_series, get_series_by_id])
}