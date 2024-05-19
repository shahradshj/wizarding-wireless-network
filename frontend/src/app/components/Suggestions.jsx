import MoviesContainer from "./MoviesContainer";
import SeriesContainer from "./SeriesContainer";
import { getMovies, getSeries, getSuggestions } from "../helpers/apiHelpers";

export default async function Suggestions({ urlSearchParams }) {
    const userId = urlSearchParams.get('userId');
    const [movies, series] = await Promise.all([getMovies(), getSeries()]);

    const suggestions = userId ? new Set(await getSuggestions(userId)) : new Set();
    const suggestedMovies = movies?.filter((movie) => suggestions.has(movie.id));
    const suggestedSeries = series?.filter((aSeries) => suggestions.has(aSeries.id));

    return (
        <div>
            {!userId && <div className='tabs-text'>Please log in to see your suggestions</div>}
            {userId &&
                <div>
                    <p className='tabs-text'>Movies</p>
                    {suggestedMovies?.length > 0 ?
                        <MoviesContainer movies={suggestedMovies} urlSearchParams={urlSearchParams} /> :
                        <p className="tabs-text">No suggested movies</p>}
                    <p className='tabs-text'>Series</p>
                    {suggestedSeries?.length > 0 ?
                        <SeriesContainer series={suggestedSeries} urlSearchParams={urlSearchParams} /> :
                        <p className="tabs-text">No suggested series</p>}
                </div>}
        </div>
    );
}