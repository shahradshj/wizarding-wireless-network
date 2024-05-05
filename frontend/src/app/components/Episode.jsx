
import './tiles.css';

const LastWatchedEpisodeStyle = {
    backgroundColor: 'rgba(0, 100, 0, 0.3)',
}

export default async function Episode({ episode, watchHistory }) {
    return (
        <div className='episode' style={watchHistory?.season === episode.season && watchHistory?.episode === episode.episode ? LastWatchedEpisodeStyle : {}}>
            <h2 className="episode-name">{`S${episode.season}E${episode.episode}`}</h2>
        </div>
    )
}
