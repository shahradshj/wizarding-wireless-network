

import NavigationBar from './NavigationBar';
import User from './User';
import MoviesContainer from './MoviesContainer';
import SeriesContainer from './SeriesContainer';
import Series from './Series';

import { getSeries, getSeriesById } from '../helpers/apiHelpers';


export default async function App({ searchParams, }) {
    const params = new URLSearchParams(searchParams);
    const navigation = params.get.navigation?.toLowerCase() || '';
    const series = await getSeries();
    let selectedSeries = null;
    if (series.some((aSeries) => aSeries.id === navigation)) {
        selectedSeries = await getSeriesById(navigation);
    }
    return (
        <div>
            <User searchParams={searchParams} />
            <NavigationBar searchParams={searchParams} />
            {navigation === 'movies' && <MoviesContainer />}
            {navigation === 'series' && <SeriesContainer searchParams={searchParams} />}
            {navigation === 'suggestions' && <div>Suggestions</div>}
            {navigation === 'favorites' && <div>Favorites</div>}
            {navigation === 'collections' && <div>Collections</div>}
            {navigation === 'genres' && <div>Genres</div>}
            {selectedSeries && <Series series={selectedSeries} />}
        </div>
    );
}