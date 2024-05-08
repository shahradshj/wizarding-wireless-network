import Link from "next/link";

import MoviesContainer from "./MoviesContainer";
import SeriesContainer from "./SeriesContainer";
import { getFavorites, getMovies, getSeries } from "../helpers/apiHelpers";

export default async function Favorites({ urlSearchParams }) {
    const userId = urlSearchParams.get('userId');

    let favorites = null;
    let movies = null;
    let series = null;

    if (userId) {
        try {
            [favorites, movies, series] = await Promise.all([
                getFavorites(userId),
                getMovies(),
                getSeries()
            ]);

            favorites = new Set(favorites);
            movies = movies.filter((movie) => favorites.has(movie.id));
            series = series.filter((aSeries) => favorites.has(aSeries.id));
        } catch (error) {
            console.error("Error fetching favorites, series, and movies:", error);
            // Handle the error here, e.g. show an error message to the user
        }
    }

    return (
        <div>
            {!userId && <div className='tabs-text'>Please log in to see your favorites</div>}
            {userId &&
                <div>
                    <p className='tabs-text'>Movies</p>
                    {movies?.length > 0 ?
                        <MoviesContainer movies={movies} urlSearchParams={urlSearchParams} /> :
                        <p className="tabs-text">No favorite movies</p>}
                    <p className='tabs-text'>Series</p>
                    {series?.length > 0 ?
                        <SeriesContainer series={series} urlSearchParams={urlSearchParams} /> :
                        <p className="tabs-text">No favorite series</p>}
                </div>}
        </div>
    );
}