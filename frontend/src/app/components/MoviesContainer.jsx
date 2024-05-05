import Link from 'next/link';
import './tiles.css'; 

import { getMovies } from '../helpers/apiHelpers';
import Movie from './Movie';


export default async function MoviesContainer() {
    const movies = await getMovies();
    const searchParams = new URLSearchParams();
    console.log(searchParams);
    return (
        <div className='movie-series-container'>
            {movies && movies.map(movie => (
                <Link key={movie.id} href={`/stream/${movie.id}`} rel="noopener noreferrer" target='_blank'>
                    <Movie movie={movie} />
                </Link>
            ))}
        </div>
    );
}