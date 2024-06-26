import MoviesContainer from "./MoviesContainer";
import SeriesContainer from "./SeriesContainer";
import { getMovies, getSeries, getFavorites } from "../helpers/apiHelpers";

export default async function Favorites({ urlSearchParams }) {
    const userId = urlSearchParams.get('userId');
    const [movies, series] = await Promise.all([getMovies(), getSeries()]);

    const favorites = userId ? new Set(await getFavorites(userId)) : new Set();
    const favoriteMovies = movies?.filter((movie) => favorites.has(movie.id));
    const favoriteSeries = series?.filter((serie) => favorites.has(serie.id));

    return (
        <div>
            {!userId && <div className='tabs-text'>Please log in to see your favorites</div>}
            {userId &&
                <div>
                    <p className='tabs-text'>Movies</p>
                    {favoriteMovies?.length > 0 ?
                        <MoviesContainer movies={favoriteMovies} urlSearchParams={urlSearchParams} /> :
                        <p className="tabs-text">No favorite movies</p>}
                    <p className='tabs-text'>Series</p>
                    {favoriteSeries?.length > 0 ?
                        <SeriesContainer series={favoriteSeries} urlSearchParams={urlSearchParams} /> :
                        <p className="tabs-text">No favorite series</p>}
                </div>}
        </div>
    );
}