import Link from 'next/link';
import './tiles.css';

import { getFavorites } from '../helpers/apiHelpers';
import Movie from './Movie';


export default async function MoviesContainer({ movies, urlSearchParams }) {
    const userIdParam = urlSearchParams.has('userId') ? '?' + new URLSearchParams({ "userId": urlSearchParams.get("userId") }) : '';
    
    const favorites = urlSearchParams.has('userId') ? new Set(await getFavorites(urlSearchParams.get('userId'))) : null;

    return (
        <div className='movie-series-container'>
            {movies && movies.map(movie => (
                <Link key={movie.id}
                    href={`/stream/${movie.id}${userIdParam}`}
                    rel="noopener noreferrer" target='_blank'>
                    <Movie urlSearchParams={urlSearchParams} movie={movie} isFavorited={favorites?.has(movie.id)}/>
                </Link>
            ))}
        </div>
    );
}