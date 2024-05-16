import Link from "next/link";

import MoviesContainer from "./MoviesContainer";

import { getMovies, getCollections } from "../helpers/apiHelpers";

export default async function Collections({ urlSearchParams }) {
    const [movies, collections] = await Promise.all([getMovies(), getCollections()]);
    const collectionNames = Object.keys(collections)
    const selectedCollection = urlSearchParams.get('collection');
    const collectionMovies = movies?.filter((movie) => collections[selectedCollection]?.includes(movie.id));

    return (
        <div>
            <nav className="collectionsbar">
                {collectionNames.map((collection) => {
                    const linkCSSClass = `nav-link ${collection === selectedCollection ? 'active' : 'inactive'}`;
                    const newParams = new URLSearchParams(urlSearchParams);
                    newParams.set('collection', collection);
                    return (
                        <Link
                            href={`?${newParams}`}
                            key={collection}
                            scroll={true}
                            className={linkCSSClass}>
                            {collection}
                        </Link>
                    );
                })}
            </nav>
            {collectionMovies && <MoviesContainer movies={collectionMovies} urlSearchParams={urlSearchParams} />}
        </div>
    );
}