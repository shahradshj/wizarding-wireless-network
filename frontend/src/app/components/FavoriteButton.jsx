'use client';

import { useState, useEffect } from 'react';

import { addFavorite, removeFavorite } from '../helpers/apiHelpers';

const FavoriteButton = ({ userId, videoId, initialIsFavorited }) => {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

    const handleClick = async () => {
        if (isFavorited) {
            const success = await removeFavorite(userId, videoId);
            if (!success) {
                console.error('Failed to remove favorite');
                return;
            }
        } else {
            const success = await addFavorite(userId, videoId);
            if (!success) {
                console.error('Failed to add favorite');
                return;
            }
        }
        setIsFavorited(!isFavorited);
        // window.location.reload();
    };

    useEffect(() => {
        setIsFavorited(initialIsFavorited);
    }, [initialIsFavorited]);

    return (
        <button className="absolute bottom-1 right-2 bg-transparent text-yellow-300 text-xl" onClick={async (e) => { e.preventDefault(); await handleClick(); }}>
            {isFavorited ? '🟊' : '☆'}
        </button>
    );
};

export default FavoriteButton;
