

import NavigationBar from './NavigationBar';
import User from './User';
import MoviesContainer from './MoviesContainer';
import SeriesContainer from './SeriesContainer';
import Series from './Series';

import { getSeries, getSeriesById } from '../helpers/apiHelpers';


export default async function App({ searchParams, }) {
    const navigation = searchParams.navigation || '';
    const otherParams = Object.keys(searchParams).filter(key => key !== 'navigation').map(key => `${key}=${searchParams[key]}`).join('&');
    const series = await getSeries();
    let selectedSeries = null;
    if (series.some((aSeries) => aSeries.id === navigation)) {
        selectedSeries = await getSeriesById(navigation);
    }
    return (
        <div>
            <User searchParams={searchParams} />
            <NavigationBar searchParams={searchParams} />
            {navigation === 'Movies' && <MoviesContainer />}
            {navigation === 'Series' && <SeriesContainer searchParams={searchParams} />}
            {navigation === 'Suggestions' && <div>Suggestions</div>}
            {navigation === 'Favorites' && <div>Favorites</div>}
            {navigation === 'Collections' && <div>Collections</div>}
            {navigation === 'Genres' && <div>Genres</div>}
            {selectedSeries && <Series series={selectedSeries} />}
        </div>
    );
}