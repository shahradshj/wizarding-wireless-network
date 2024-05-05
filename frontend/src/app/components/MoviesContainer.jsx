import Link from 'next/link';
import './tiles.css';

import { getMovies } from '../helpers/apiHelpers';
import Movie from './Movie';


export default async function MoviesContainer({ searchParams }) {
    const movies = await getMovies();
    const params = new URLSearchParams(searchParams);
    const userIdParam = params.has('userId') ? '?' + new URLSearchParams({ "userId": params.get("userId") }) : '';

    return (
        <div className='movie-series-container'>
            {movies && movies.map(movie => (
                <Link key={movie.id}
                    href={`/stream/${movie.id}${userIdParam}`}
                    rel="noopener noreferrer" target='_blank'>
                    <Movie movie={movie} />
                </Link>
            ))}
        </div>
    );
}