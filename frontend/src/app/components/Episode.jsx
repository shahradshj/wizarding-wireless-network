
import './tiles.css';

export default async function Episode({ episode, watchHistory }) {
    return (
        <div className='episode' style={watchHistory?.season === episode.season && watchHistory?.episode === episode.episode ? { backgroundColor: 'rgba(0, 100, 0, 0.3)' } : {}}>
            <h2 className="episode-name">{`S${episode.season}E${episode.episode}`}</h2>
        </div>
    )
}
