import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

import './tiles.css';
import Season from './Season';
import Episode from './Episode';
import FavoriteButton from './FavoriteButton';
import { getWatchHistory } from '../helpers/apiHelpers';


export default async function Series({ series, urlSearchParams, isFavorited = false }) {

    const EpisodesBySeason = series.episodes?.reduce((acc, episode) => {
        acc[episode.season] = acc[episode.season] || { 'season': episode.season, 'episodes': [] };
        acc[episode.season]['episodes'].push(episode);
        return acc;
    }, {});
    let watchHistory = 0;
    if (EpisodesBySeason && urlSearchParams.has('userId')) {
        watchHistory = await getWatchHistory(urlSearchParams.get('userId'), series.id);
    }
    const lastSeenSeason = Math.floor(watchHistory / 100);
    const lastSeenEpisodeNumber = watchHistory % 100;
    const lastSeenEpisode = EpisodesBySeason ? EpisodesBySeason[lastSeenSeason]?.episodes.find((episode) => episode.episode === lastSeenEpisodeNumber) : null;
    const lastSeenEpisodeUrl = lastSeenEpisode ? `/stream/${lastSeenEpisode?.id}?${new URLSearchParams({ userId: urlSearchParams.get('userId') })}` : null;

    return (
        <div>
            <div className='title'>
                <img src={`${BASE_URL}/posters/${series.id}`} alt={series.name} className="poster" />
                <div className="info">
                    <h2 className="name">{series.name}</h2>
                    <p className="year">{`(${series.start_year} - ${series.end_year !== 0 ? series.end_year : ''})`}</p>
                    {urlSearchParams?.has('userId') && <FavoriteButton userId={urlSearchParams.get('userId')} videoId={series.id} initialIsFavorited={isFavorited} />}
                </div>
            </div>
            {lastSeenEpisode && <div className="w-48 mt-2 mb-5 relative flex justify-center text-center">
                <Link
                    href={lastSeenEpisodeUrl} key={lastSeenEpisode.id} rel="noopener noreferrer" target="_blank">
                    <p className='content-center mx-2 bg-green-700 bg-opacity-30'>Continue</p>
                    <Episode episode={lastSeenEpisode}  />
                </Link>
            </div>}
            {EpisodesBySeason && Object.keys(EpisodesBySeason).map((season) => (
                <Season key={season} urlSearchParams={urlSearchParams} watchHistory={{ 'season': lastSeenSeason, 'episode': lastSeenEpisodeNumber }} season={EpisodesBySeason[season]} />
            ))}
        </div>
    );
}

