

import NavigationBar from './NavigationBar';
import User from './User';
import MoviesContainer from './MoviesContainer';
import SeriesContainer from './SeriesContainer';
import Series from './Series';
import Favorites from './Favorites';

import { getMovies, getSeries, getSeriesById, getFavorites } from '../helpers/apiHelpers';

async function getMoviesSeriesFavorites() {
    try {
        const [movies, series, favorites ] = await Promise.all([
            getMovies(),
            getSeries(),
            new Set(await getFavorites()),
        ]);
        return [movies, series, favorites];
    } catch (error) {
        console.error(error);
        return [null, null, null];
    }
} 


export default async function App({ searchParams, }) {
    const urlSearchParams = new URLSearchParams(searchParams);
    const navigation = urlSearchParams.get('navigation')?.toLowerCase() || '';
    const [movies, series, favorites ] = await getMoviesSeriesFavorites();
    let selectedSeries = null;
    if (series?.some((aSeries) => aSeries.id === navigation)) {
        selectedSeries = await getSeriesById(navigation);
    }
    return (
        <div>
            <User searchParams={urlSearchParams} />
            <NavigationBar urlSearchParams={urlSearchParams} />
            {navigation === 'movies' && <MoviesContainer movies={movies} urlSearchParams={urlSearchParams} />}
            {navigation === 'series' && <SeriesContainer series={series} urlSearchParams={urlSearchParams} />}
            {navigation === 'suggestions' && <div className='tabs-text'>Suggestions</div>}
            {navigation === 'favorites' && <Favorites urlSearchParams={urlSearchParams}/>}
            {navigation === 'collections' && <div className='tabs-text'>Collections</div>}
            {navigation === 'genres' && <div className='tabs-text'>Genres</div>}
            {selectedSeries && <Series urlSearchParams={urlSearchParams} series={selectedSeries} isFavorited={favorites?.has(selectedSeries.id)} />}
        </div>
    );
}