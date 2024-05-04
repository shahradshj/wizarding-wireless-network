import React from 'react';
import Link from 'next/link';
import './tiles.css'; 

import { getMovies } from '../helpers/apiHelpers';
import Movie from './Movie';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


export default async function Movies() {
    const movies = await getMovies();
    return (
        <div className='movie-series-container'>
            {movies && movies.map(movie => (
                <Link key={movie.id} href={`${BASE_URL}/stream/${movie.id}`} rel="noopener noreferrer">
                    <Movie movie={movie} />
                </Link>
            ))}
        </div>
    );
}