import './tiles.css';

import FavoriteButton from './FavoriteButton';
import Image from 'next/image';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const FILE_SIZE_DIVISOR = 1024 * 1024;

export default async function Movie({ movie, urlSearchParams, isFavorited = false }) {
  return (
    <div className='title shadow-lg group'>
      <Image src={`${BASE_URL}/posters/${movie.id}`} alt={movie.name} className="poster" width={200} height={200} />
      <p className='absolute top-0 py-2 px-2 text-right bg-black w-full bg-opacity-70 text-white scale-0 group-hover:scale-100 transition-all duration-300'>
        {Math.round(movie.size_in_bytes / FILE_SIZE_DIVISOR) / 1000}GB
      </p>
      <div className="info">
        <h2 className="name">{movie.name}</h2>
        <p className="year">{movie.year}</p>
        {urlSearchParams?.has('userId') && <FavoriteButton userId={urlSearchParams.get('userId')} videoId={movie.id} initialIsFavorited={isFavorited} />}
      </div>
    </div>
  );
}

