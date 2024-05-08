import Link from 'next/link';
import './tiles.css';

import { getSeries, getFavorites } from '../helpers/apiHelpers';
import Series from './Series';

export default async function SeriesContainer({ searchParams }) {
    const series = await getSeries();
    const params = new URLSearchParams(searchParams);
    const setNav = (id) => {
        const newParams = new URLSearchParams(params);
        newParams.set('navigation', id);
        return '?' + newParams;
    }

    const favorites = params.has('userId') ? new Set(await getFavorites(params.get('userId'))) : null;

    return (
        <div className='movie-series-container'>
            {series && series.map(aSeries => (
                <Link key={aSeries.id} scroll={true} href={setNav(aSeries.id)}>
                    <Series series={aSeries} isFavorited={favorites?.has(aSeries.id)}/>
                </Link>
            ))}
        </div>
    );
}
