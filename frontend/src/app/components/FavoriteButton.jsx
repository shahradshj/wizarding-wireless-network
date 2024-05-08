'use client';

import { useState, useEffect } from 'react';

import { addFavorite, removeFavorite } from '../helpers/apiHelpers';

const FavoriteButton = ({ videoId, initialIsFavorited }) => {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

    const handleClick = async () => {
        if (isFavorited) {
            const success = await removeFavorite(videoId);
            if (!success) {
                console.error('Failed to remove favorite');
                return;
            }
        } else {
            const success = await addFavorite(videoId);
            if (!success) {
                console.error('Failed to add favorite');
                return;
            }
        }
        setIsFavorited(!isFavorited);
    };

    useEffect(() => {
        setIsFavorited(initialIsFavorited);
    }, [initialIsFavorited]);

    return (
        <button className="flex bg-transparent" onClick={async (e) => {e.preventDefault(); await handleClick();}}>
            {isFavorited ? '🟊' : '☆'}
        </button>
    );
};

export default FavoriteButton;
