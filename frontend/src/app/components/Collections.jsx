import Link from "next/link";

import MoviesContainer from "./MoviesContainer";

import { getCollections } from "../helpers/apiHelpers";

export default async function Collections({ movies, urlSearchParams }) {
    const collections = await getCollections();
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