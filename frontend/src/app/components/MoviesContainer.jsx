import Link from 'next/link';
import './tiles.css';

import { getMovies, getFavorites } from '../helpers/apiHelpers';
import Movie from './Movie';


export default async function MoviesContainer({ searchParams }) {
    const params = new URLSearchParams(searchParams);
    const userIdParam = params.has('userId') ? '?' + new URLSearchParams({ "userId": params.get("userId") }) : '';
    
    const movies = await getMovies();
    const favorites = params.has('userId') ? new Set(await getFavorites(params.get('userId'))) : null;

    return (
        <div className='movie-series-container'>
            {movies && movies.map(movie => (
                <Link key={movie.id}
                    href={`/stream/${movie.id}${userIdParam}`}
                    rel="noopener noreferrer" target='_blank'>
                    <Movie movie={movie} isFavorited={favorites?.has(movie.id)}/>
                </Link>
            ))}
        </div>
    );
}