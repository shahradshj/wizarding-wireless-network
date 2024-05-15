import Link from "next/link";

import MoviesContainer from "./MoviesContainer";
import SeriesContainer from "./SeriesContainer";
import { getGenres, getIdsByGenre } from "../helpers/apiHelpers";

export default async function Genres({ movies, series, urlSearchParams }) {
    const genres = await getGenres();
    const genre = urlSearchParams.get('genre');
    const genreIds = genre ? new Set(await getIdsByGenre(genre)) : new Set();

    const genreMovies = genreIds.size > 0 ? movies?.filter((movie) => genreIds.has(movie.id)) : null;
    const genreSeries = genreIds.size > 0 ? series?.filter((serie) => genreIds.has(serie.id)) : null;

    return (
        <div >
            <nav className="genresbar">
                {genres.map((genre) => {
                    const linkCSSClass = `nav-link ${genre === urlSearchParams.get('genre') ? 'active' : 'inactive'}`;
                    const newParams = new URLSearchParams(urlSearchParams);
                    newParams.set('genre', genre);
                    return (
                        <Link
                            href={`?${newParams}`}
                            key={genre}
                            scroll={true}
                            className={linkCSSClass}>
                            {genre}
                        </Link>
                    );
                })}
            </nav>
            {genre && <div className="grid grid-cols-2">
                <div>
                    <p className='tabs-text'>{genreMovies?.length > 0 ? 'Movies' : `No ${genre} movies`}</p>
                    {genreMovies?.length > 0 &&
                        <MoviesContainer movies={genreMovies} urlSearchParams={urlSearchParams} />}
                </div>
                <div>
                    <p className='tabs-text'>{genreSeries?.length > 0 ? 'Series' : `No ${genre} series`}</p>
                    {genreSeries?.length > 0 &&
                        <SeriesContainer series={genreSeries} urlSearchParams={urlSearchParams} />}
                </div>

            </div>}
        </div>
    );
}