#[macro_use]
extern crate rocket;
extern crate rusqlite;

mod database_access;

use rocket::serde::json::Json;
use crate::database_access::{get_movies_from_db, get_series_from_db, get_series_seasons_from_db};

const DATABASE_PATH: &str = "../movie-database/database.db";

#[get("/movies")]
async fn get_movies() -> Json<Vec<Movie>> {
    let movies = get_movies_from_db(DATABASE_PATH);
    Json(movies)
}

#[get("/series")]
async fn get_series() -> Json<Vec<Series>> {
    let series = get_series_from_db(DATABASE_PATH);
    Json(series)
}

#[get("/series/<id>")]
async fn get_series_by_id(id: &str) -> Json<Series> {
    let series = get_series_seasons_from_db(DATABASE_PATH, id);
    Json(series)
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![get_movies, get_series, get_series_by_id])
}
