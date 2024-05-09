import './tiles.css';

import FavoriteButton from './FavoriteButton';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Movie({ movie, urlSearchParams, isFavorited = false }) {
  return (
    <div className='title'>
      <img src={`${BASE_URL}/posters/${movie.id}`} alt={movie.name} className="poster" />
      <div className="info">
        <h2 className="name">{movie.name}</h2>
        <p className="year">{movie.year}</p>
        {urlSearchParams?.has('userId') && <FavoriteButton userId={urlSearchParams.get('userId')} videoId={movie.id} initialIsFavorited={isFavorited} />}
      </div>
    </div>
  );
}

