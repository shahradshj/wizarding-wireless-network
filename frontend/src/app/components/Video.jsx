'use client'

import React, { useRef } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const WATCH_HISTORY_UPDATE_INTERVAL = 5000;


import './tiles.css';

import { setWatchHistory } from '@/app/helpers/apiHelpers';

function UpdateWatchHistory(userId, videoId, videoRef) {
    if (!userId || !videoId || !videoRef || !videoRef.current || !videoRef.current.currentTime) {
        console.error("Invalid parameters", userId, videoId, videoRef);
        return;
    }
    const newTime = Math.floor(videoRef.current.currentTime);
    console.log("Updating watch history", userId, videoId, newTime);
    setWatchHistory(userId, videoId, newTime).then((result) => {
        if (!result) {
            console.error("Error updating watch history");
        }
    });
}

export default function Video({ videoId, videoTime, userId }) {
    const videoUrl = `${BASE_URL}/videos/${videoId}#t=${videoTime}`;

    const videoRef = useRef(null);

    let updateWatchHistoryTimer = null;

    return (
        <div className='video-component'>
            <video className='video-player' id="video" ref={videoRef} controls
                onPause={() => { console.log("Stopping interval", updateWatchHistoryTimer); clearInterval(updateWatchHistoryTimer) }}
                onPlay={() => {
                    clearInterval(updateWatchHistoryTimer);
                    updateWatchHistoryTimer = setInterval(() => UpdateWatchHistory(userId, videoId, videoRef), WATCH_HISTORY_UPDATE_INTERVAL);
                }}>
                <source src={videoUrl} />
            </video>
        </div>
    );
}