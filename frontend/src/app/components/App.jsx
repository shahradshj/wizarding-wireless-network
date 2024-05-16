

import NavigationBar from './NavigationBar';
import User from './User';
import MoviesContainer from './MoviesContainer';
import SeriesContainer from './SeriesContainer';
import Series from './Series';
import Favorites from './Favorites';
import Genres from './Genres';
import Collections from './Collections';

import { getMovies, getSeries, getSeriesById, getFavorites } from '../helpers/apiHelpers';

export const dynamic = 'force-dynamic';

export default async function App({ searchParams, }) {
    const urlSearchParams = new URLSearchParams(searchParams);
    const navigation = urlSearchParams.get('navigation')?.toLowerCase() || '';
    const [movies, series, favorites] = await Promise.all([
        getMovies(),
        getSeries(),
        urlSearchParams.has('userId') ? getFavorites(urlSearchParams.get('userId')) : null,
    ]);
    const favoritesSet = new Set(favorites);

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
            {navigation === 'favorites' && <Favorites urlSearchParams={urlSearchParams} />}
            {navigation === 'collections' && <Collections urlSearchParams={urlSearchParams} />}
            {navigation === 'genres' && <Genres urlSearchParams={urlSearchParams} />}
            {selectedSeries && <Series urlSearchParams={urlSearchParams} series={selectedSeries} isFavorited={favoritesSet.has(selectedSeries.id)} />}
        </div>
    );
}