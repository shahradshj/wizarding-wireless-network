import './tiles.css';

import Season from './Season';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Series({ series }) {

    const EpisodesBySeries = series.episodes?.reduce((acc, episode) => {
        acc[episode.season] = acc[episode.season] || { 'season': episode.season, 'episodes': [] };
        acc[episode.season]['episodes'].push(episode);
        return acc;
    }, {});
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
                <Season season={EpisodesBySeries[season]} />
            ))}
        </div>
    );
}

