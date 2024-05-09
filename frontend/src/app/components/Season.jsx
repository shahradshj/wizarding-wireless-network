import Link from 'next/link';

import './tiles.css';
import Episode from './Episode';

const LastWatchedSeasonStyle = {
    backgroundColor: 'rgba(0, 100, 0, 0.3)',
}

export default async function Season({ season, urlSearchParams, watchHistory }) {
    const userIdParam = urlSearchParams.has('userId') ? '?' + new URLSearchParams({ "userId": urlSearchParams.get("userId") }) : '';

    return (
        <div>
            <h2 className="season-name" style={watchHistory?.season === season.season ? LastWatchedSeasonStyle : {}}>{`Season ${season.season}`}</h2>
            <div className="episode-container">
                {season['episodes'].map((episode) => (
                    <Link href={`/stream/${episode.id}${userIdParam}`} key={episode.id} rel="noopener noreferrer" target="_blank">
                        <Episode watchHistory={watchHistory} episode={episode} />
                    </Link>
                ))}
            </div>

        </div>
    )
}