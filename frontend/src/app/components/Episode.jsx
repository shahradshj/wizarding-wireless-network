
import './tiles.css';

export default async function Episode({ episode }) {
    return (
        <div className='episode'>
            <h2 className="episode-name">{`S${episode.season}E${episode.episode}`}</h2>
        </div>
    )
}
