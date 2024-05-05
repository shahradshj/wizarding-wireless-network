import './tiles.css';

import Season from './Season';

import { getWatchHistory } from '../helpers/apiHelpers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Series({ series, searchParams }) {

    const params = new URLSearchParams(searchParams);

    const EpisodesBySeries = series.episodes?.reduce((acc, episode) => {
        acc[episode.season] = acc[episode.season] || { 'season': episode.season, 'episodes': [] };
        acc[episode.season]['episodes'].push(episode);
        return acc;
    }, {});
    let watchHistory = 0;
    if (EpisodesBySeries && params.has('userId')) {
        watchHistory = await getWatchHistory(params.get('userId'), series.id);
    }
    const lastSeenSeason = Math.floor(watchHistory / 100);
    const lastSeenEpisode = watchHistory % 100;

    return (
        <div>
            <div className='title'>
                <img src={`${BASE_URL}/poster/${series.id}`} alt={series.name} className="poster" />
                <div className="info">
                    <h2 className="name">{series.name}</h2>
                    <p className="year">{`(${series.start_year} - ${series.end_year !== 0 ? series.end_year : ''} )`}</p>
                </div>
            </div>
            {EpisodesBySeries && Object.keys(EpisodesBySeries).map((season) => (
                <Season key={season} searchParams={searchParams} watchHistory={{'season': lastSeenSeason, 'episode': lastSeenEpisode}} season={EpisodesBySeries[season]} />
            ))}
        </div>
    );
}

