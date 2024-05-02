import React from 'react';
import { use } from 'react';

import { getMovies } from '../helpers/apiHelpers';
import Movie from './Movie';

export default function Movies() {
    const movies = use(getMovies());
    return (
        <div>
            {movies && movies.map(movie => (
                <Movie key={movie.id} movie={movie} />
            ))}
        </div>
    );
}