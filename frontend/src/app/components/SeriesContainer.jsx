import Link from 'next/link';
import './tiles.css';

import { getSeries, getFavorites } from '../helpers/apiHelpers';
import Series from './Series';

export default async function SeriesContainer({ series, urlSearchParams }) {
    const setNav = (id) => {
        const newParams = new URLSearchParams(urlSearchParams);
        newParams.set('navigation', id);
        return '?' + newParams;
    }

    const favorites = urlSearchParams.has('userId') ? new Set(await getFavorites(urlSearchParams.get('userId'))) : null;

    return (
        <div className='movie-series-container'>
            {series && series.map(aSeries => (
                <Link key={aSeries.id} scroll={true} href={setNav(aSeries.id)}>
                    <Series urlSearchParams={urlSearchParams} series={aSeries} isFavorited={favorites?.has(aSeries.id)}/>
                </Link>
            ))}
        </div>
    );
}
