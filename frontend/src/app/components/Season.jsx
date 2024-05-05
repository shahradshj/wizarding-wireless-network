import Link from 'next/link';

import './tiles.css';
import Episode from './Episode';

export default async function Season({ season }) {
    return (
        <div>
            <h2 className="season-name">{`Season ${season['season']}`}</h2>
            <div className="episode-container">
                {season['episodes'].map((episode) => (
                    <Link href={`/stream/${episode.id}`} key={episode.id} rel="noopener noreferrer" target="_blank">
                        <Episode episode={episode} />
                    </Link>
                ))}
            </div>

        </div>
    )
}