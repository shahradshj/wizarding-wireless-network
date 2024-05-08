

import NavigationBar from './NavigationBar';
import User from './User';
import MoviesContainer from './MoviesContainer';
import SeriesContainer from './SeriesContainer';
import Series from './Series';
import Favorites from './Favorites';

import { getMovies, getSeries, getSeriesById } from '../helpers/apiHelpers';


export default async function App({ searchParams, }) {
    const params = new URLSearchParams(searchParams);
    const navigation = params.get('navigation')?.toLowerCase() || '';
    const [movies, series ] = await Promise.all([
        getMovies(),
        getSeries()
    ]);
    let selectedSeries = null;
    if (series?.some((aSeries) => aSeries.id === navigation)) {
        selectedSeries = await getSeriesById(navigation);
    }
    return (
        <div>
            <User searchParams={searchParams} />
            <NavigationBar searchParams={searchParams} />
            {navigation === 'movies' && <MoviesContainer searchParams={searchParams} />}
            {navigation === 'series' && <SeriesContainer searchParams={searchParams} />}
            {navigation === 'suggestions' && <div>Suggestions</div>}
            {navigation === 'favorites' && <Favorites searchParams={searchParams}/>}
            {navigation === 'collections' && <div>Collections</div>}
            {navigation === 'genres' && <div>Genres</div>}
            {selectedSeries && <Series searchParams={searchParams} series={selectedSeries} />}
        </div>
    );
}