
import './StreamPage.css';
import Video from '@/app/components/Video';
import User from '@/app/components/User';
import { getWatchHistory, getVideoInfo, setWatchHistory } from "@/app/helpers/apiHelpers";

export async function generateMetadata({ params }) {
    const videoId = params.id
    const videoName = VideoInfoToName(await getVideoInfo(videoId));
    return {
        title: videoName,
    }
}

function VideoInfoToName(info) {
    if (!info || !info.type) {
        return "";
    }
    if (info.type === "movie") {
        return `${info.movie.name} (${info.movie.year})`;
    }
    if (info.type === "episode") {
        return `${info.episode.name} (Season ${info.episode.season} - Episode ${info.episode.episode})`;
    }
    return "";
}

export default async function StreamPage({ params, searchParams, }) {

    const videoId = params.id;
    const info = await getVideoInfo(videoId);
    const title = VideoInfoToName(info);

    let videoTime = 0;
    const urlSearchParams = new URLSearchParams(searchParams);
    if (urlSearchParams.has('userId')) {
        console.log("User ID", urlSearchParams.get('userId'));
        try {
            videoTime = await getWatchHistory(urlSearchParams.get('userId'), videoId);
            if (info && info.type === "episode") {
                const episodeNumber = info.episode.season * 100 + info.episode.episode;
                await setWatchHistory(urlSearchParams.get('userId'), info.episode.series_id, episodeNumber);
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