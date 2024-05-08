import Link from "next/link";

import Movie from "./Movie";
import Series from "./Series";
import { getFavorites, getMovies, getSeries } from "../helpers/apiHelpers";

export default async function Favorites({ searchParams }) {
    const params = new URLSearchParams(searchParams);
    const userId = params.get('userId');


    let favorites = null;
    let series = null;
    let movies = null;

    if (userId) {
        [favorites, series, movies] = await Promise.all([
            getFavorites(userId),
            getSeries(),
            getMovies()
        ]);
        
        favorites = new Set(favorites);
    }

    const setNavForSeries = (id) => {
        const newParams = new URLSearchParams(params);
        newParams.set('navigation', id);
        return '?' + newParams;
    }

    return (
        <div className="flex">
            {!userId && <div>Please log in to see your favorites</div>}
            {userId && <div>Your favorites</div>}
            {userId &&
                <div className="flex">
                    <div className="flex-column">
                        <div>Series</div>
                        {series ? series.map((aSeries) => {
                            if (favorites.has(aSeries.id)) {
                                return (
                                    <Link key={aSeries.id} scroll={true} href={setNavForSeries(aSeries.id)}>
                                        <Series series={aSeries} isFavorited={true}/>
                                    </Link>
                                );
                            }
                        }) : 
                        <div>No favorite series</div>}
                    </div>
                    <div className="flex-column">
                        <div>Movies</div>
                        {movies ? movies.map((movie) => {
                            if (favorites.has(movie.id)) {
                                return (
                                    <Link key={movie.id}
                                        href={`/stream/${movie.id}?${new URLSearchParams({ userId: userId })}`}
                                        rel="noopener noreferrer" target='_blank'>
                                        <Movie movie={movie} isFavorited={true}/>
                                    </Link>
                                );
                            }
                        }) : 
                        <div>No favorite movies</div>}
                    </div>
                </div>}
        </div>
    );
}