import Link from 'next/link';
import './tiles.css';

import { getSeries } from '../helpers/apiHelpers';
import Series from './Series';

export default async function SeriesContainer({ searchParams }) {
    const series = await getSeries();
    const params = new URLSearchParams(searchParams);
    const setNav = (id) => {
        params.set('navigation', id);
        return '?' + params;
      }
    return (
        <div className='movie-series-container'>
            {series && series.map(aSeries => (
                <Link key={aSeries.id} scroll={true} href={setNav(aSeries.id)}>
                    <Series series={aSeries} />
                </Link>
            ))}
        </div>
    );
}
