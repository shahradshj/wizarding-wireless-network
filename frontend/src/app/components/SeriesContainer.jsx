import Link from 'next/link';
import './tiles.css';

import { getSeries } from '../helpers/apiHelpers';
import Series from './Series';

export default async function SeriesContainer({ searchParams }) {
    const series = await getSeries();
    const otherParams = Object.keys(searchParams).filter(key => key !== 'navigation').map(key => `${key}=${searchParams[key]}`).join('&');
    return (
        <div className='movie-series-container'>
            {series && series.map(aSeries => (
                <Link key={aSeries.id} scroll={true} href={`/?navigation=${aSeries.id}` + (otherParams ? `&${otherParams}` : '')}>
                    <Series series={aSeries} />
                </Link>
            ))}
        </div>
    );
}
