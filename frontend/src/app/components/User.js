'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { addUser, getUserId, getUserName } from '../helpers/apiHelpers';

const User = ({ searchParams }) => {
    const router = useRouter();
    const otherParams = Object.keys(searchParams).filter(key => key !== 'userId').map(key => `${key}=${searchParams[key]}`).join('&');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(searchParams.userId || '');

    useEffect(() => {
        console.log('User:', userId, userName, searchParams.userId);
        if (userName === '' && userId !== '') {
            getUserName(userId).then(name => setUserName(name));
        }

        if (userId === '') {
            router.replace(`?${otherParams}`);
        }
        else if (searchParams.userId || searchParams.userId !== userId) {
            router.replace(`?userId=${userId}` + (otherParams ? `&${otherParams}` : ''));
        }
        
    }, [userId, searchParams.userId]);

    const handleSignUp = async () => {
        console.log('Signing up:', userName);
        try {
            const id = await addUser(userName);
            setUserId(id);
        } catch (error) {
            console.error('Error during sign up:', error);
        }
    };

    const handleSignIn = async () => {
        console.log('Signing in:', userName);
        try {
            const id = await getUserId(userName);
            setUserId(id);
        } catch (error) {
            console.error('Error during sign in:', error);
        }
    };

    return (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', textAlign: 'right' }}>
            {userId === '' && <input
                style={{ width: '150px', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0)' }}
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter username"
            />}
            {userId === '' && <button onClick={handleSignUp} style={{ margin: '5px', color: 'white' }}>Sign Up</button>}
            {userId === '' && <button onClick={handleSignIn} style={{ margin: '5px', color: 'white' }}>Sign In</button>}
            {userId !== '' && <p>Welcome {userName}!<button style={{ margin: '5px', color: 'white' }} onClick={() => setUserId('')}>Sign Out</button></p>}
        </div>
    );
};

export default User;
