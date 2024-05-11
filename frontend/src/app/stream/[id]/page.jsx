
import './StreamPage.css';
import Video from '@/app/components/Video';
import User from '@/app/components/User';
import { getWatchHistory, getVideoType, setWatchHistory } from "@/app/helpers/apiHelpers";

export async function generateMetadata({ params }) {
    const videoId = params.id
    const videoName = VideoTypeToName(await getVideoType(videoId));
    return {
        title: videoName,
    }
}

function VideoTypeToName(videoType) {
    if (!videoType || !videoType.type) {
        return "";
    }
    if (videoType.type === "movie") {
        return `${videoType.movie.name} (${videoType.movie.year})`;
    }
    if (videoType.type === "episode") {
        return `${videoType.episode.name} (Season ${videoType.episode.season} - Episode ${videoType.episode.episode})`;
    }
    return "";
}

export default async function StreamPage({ params, searchParams, }) {

    const videoId = params.id;
    const videoType = await getVideoType(videoId);
    const title = VideoTypeToName(videoType);

    let videoTime = 0;
    const urlSearchParams = new URLSearchParams(searchParams);
    if (urlSearchParams.has('userId')) {
        console.log("User ID", urlSearchParams.get('userId'));
        try {
            videoTime = await getWatchHistory(urlSearchParams.get('userId'), videoId);
            if (videoType && videoType.type === "episode") {
                const episodeNumber = videoType.episode.season * 100 + videoType.episode.episode;
                await setWatchHistory(urlSearchParams.get('userId'), videoType.episode.series_id, episodeNumber);
            }
        }
        catch (error) {
            console.error("Error fetching watch history for video: ", error);
        }
    }

    return (
        <div className='stream-page'>
            <User searchParams={searchParams} />
            <h1 style={{ padding: '10px', color: 'white' }}>{title}</h1>
            <Video videoId={videoId} videoTime={videoTime} userId={urlSearchParams.get('userId')} />
        </div>
    );
}