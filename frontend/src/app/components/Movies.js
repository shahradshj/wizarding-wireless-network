import React from 'react';
import Link from 'next/link';
import './tiles.css'; 

import { getMovies } from '../helpers/apiHelpers';
import Movie from './Movie';

export default async function Movies() {
    const movies = await getMovies();
    return (
        <div className='movie-series-container'>
            {movies && movies.map(movie => (
                <Movie key={movie.id} movie={movie} />
                // <Link href={`/movies/${movie.id}`} key={movie.id}>
                //     <Movie movie={movie} />
                // </Link>
            ))}
        </div>
    );
}