'use client'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const WATCH_HISTORY_UPDATE_INTERVAL = 5000;

import React, { useRef, useEffect } from 'react';

import './tiles.css';

import { setWatchHistory } from '@/app/helpers/apiHelpers';

function UpdateWatchHistory(userId, videoId, videoRef) {
    if (!videoRef || !videoRef.current || !videoRef.current.currentTime) {
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

export default function Video({ videoId, videoTime, userId, videoName }) {
    const videoUrl = `${BASE_URL}/video/${videoId}`;
    if (videoName) {
        document.title = videoName;
    }

    const videoRef = useRef(null);
    useEffect(() => {
        if (videoRef.current) {
            console.log("Setting video time", videoTime);
            videoRef.current.currentTime = videoTime;
        }
    }, [videoRef]);

    let updateWatchHistoryTimer = null;

    // useEffect(() => {
    //     const keyDownHandler = (e) => {
    //         console.log(`You pressed ${e.code}.`, videoRef);
    //         if (!videoRef || !videoRef.current) {
    //             return;
    //         }
    //         if (e.code === 'Space') {
    //             console.log('Toggling play/pause', videoRef.current.paused);
    //             if (videoRef.current.paused) {
    //                 videoRef.current.play();
    //             } else {
    //                 videoRef.current.pause();
    //             }
    //         }
    //         if (e.code === 'ArrowLeft') {
    //             console.log('Going back 10 seconds', videoRef.current.currentTime);
    //             videoRef.current.currentTime -= 10;
    //             console.log('New time', videoRef.current.currentTime);
    //         }
    //     };
    //     document.addEventListener('keydown', keyDownHandler);
    // }, []);

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