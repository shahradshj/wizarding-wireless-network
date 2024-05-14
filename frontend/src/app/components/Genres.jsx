import Link from "next/link";

import MoviesContainer from "./MoviesContainer";
import SeriesContainer from "./SeriesContainer";
import { getGenres, getIdsByGenre } from "../helpers/apiHelpers";

export default async function Genres({ movies, series, urlSearchParams }) {
    const genres = await getGenres();
    const genre = urlSearchParams.get('genre');
    const genreIds = genre ? new Set(await getIdsByGenre(genre)) : new Set();

    const genreMovies = genreIds.length > 0 ? movies?.filter((movie) => genreIds.has(movie.id)) : null;
    const genreSeries = genreIds.length > 0 ? series?.filter((serie) => genreIds.has(serie.id)) : null;

    return (
        <div>
            <nav className="navbar">
                {genres.map((genre) => {
                    const linkCSSClass = `nav-link ${genre === urlSearchParams.get('genre') ? 'active' : 'inactive'}`;
                    const newParams = new URLSearchParams(urlSearchParams);
                    newParams.set('genre', genre);
                    return (
                        <Link
                            href={`?${newParams}`}
                            key={genre}
                            scroll={true}
                            className={linkCSSClass}
                        >
                            {genre}
                        </Link>
                    );
                })}
            </nav>
            {genre && <div>
                <p className='tabs-text'>Movies</p>
                {genreMovies?.length > 0 ?
                    <MoviesContainer movies={genreMovies} urlSearchParams={urlSearchParams} /> :
                    <p className="tabs-text">No movies in this genre</p>}
                <p className='tabs-text'>Series</p>
                {genreSeries?.length > 0 ?
                    <SeriesContainer series={genreSeries} urlSearchParams={urlSearchParams} /> :
                    <p className="tabs-text">No series in this genre</p>}
            </div>}
        </div>
    );
}