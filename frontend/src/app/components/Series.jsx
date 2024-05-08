import Link from 'next/link';


import './tiles.css';
import Season from './Season';
import Episode from './Episode';
import FavoriteButton from './FavoriteButton';
import { getWatchHistory } from '../helpers/apiHelpers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Series({ series, searchParams, isFavorited = false}) {

    const params = new URLSearchParams(searchParams);

    const EpisodesBySeason = series.episodes?.reduce((acc, episode) => {
        acc[episode.season] = acc[episode.season] || { 'season': episode.season, 'episodes': [] };
        acc[episode.season]['episodes'].push(episode);
        return acc;
    }, {});
    let watchHistory = 0;
    if (EpisodesBySeason && params.has('userId')) {
        watchHistory = await getWatchHistory(params.get('userId'), series.id);
    }
    const lastSeenSeason = Math.floor(watchHistory / 100);
    const lastSeenEpisodeNumber = watchHistory % 100;
    const lastSeenEpisode = EpisodesBySeason ? EpisodesBySeason[lastSeenSeason]?.episodes.find((episode) => episode.episode === lastSeenEpisodeNumber) : null;
    const lastSeenEpisodeUrl = lastSeenEpisode ? `/stream/${lastSeenEpisode?.id}?${new URLSearchParams({ userId: params.get('userId') })}` : null;

    return (
        <div>
            <div className='title'>
                <img src={`${BASE_URL}/posters/${series.id}`} alt={series.name} className="poster" />
                <div className="info">
                    <h2 className="name">{series.name}</h2>
                    <p className="year">{`(${series.start_year} - ${series.end_year !== 0 ? series.end_year : ''})`}</p>
                    <FavoriteButton videoId={series.id} initialIsFavorited={isFavorited} />
                </div>
            </div>
            {lastSeenEpisode && <Link className="episode-container" href={lastSeenEpisodeUrl} key={lastSeenEpisode.id} rel="noopener noreferrer" target="_blank">
                    <p className='last-watched'>Continue</p>
                    <Episode episode={lastSeenEpisode} watchHistory={{ 'season': lastSeenSeason, 'episode': lastSeenEpisodeNumber }} />
                </Link>}
            {EpisodesBySeason && Object.keys(EpisodesBySeason).map((season) => (
                <Season key={season} searchParams={searchParams} watchHistory={{ 'season': lastSeenSeason, 'episode': lastSeenEpisodeNumber }} season={EpisodesBySeason[season]} />
            ))}
        </div>
    );
}

