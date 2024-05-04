'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { addUser, getUserId, getUserName } from '../helpers/apiHelpers';

const User = ({ searchParams }) => {
    const router = useRouter();
    const otherParams = Object.keys(searchParams).filter(key => key !== 'userId').map(key => `${key}=${searchParams[key]}`).join('&');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (searchParams.userId) {
            getUserName(searchParams.userId).then(name => {
                if (name) {
                    setUserName(name);
                }
                else {
                    router.replace(`?${otherParams}`);
                }
            }).catch(console.error);
        }
    }, []);

    const handleSignUp = async () => {
        console.log('Signing up:', userName);
        try {
            const id = await addUser(userName);
            if (id) {
                router.replace(`?userId=${id}` + (otherParams ? `&${otherParams}` : ''));
            }
        } catch (error) {
            console.error('Error during sign up:', error);
        }
    };

    const handleSignIn = async () => {
        console.log('Signing in:', userName);
        try {
            const id = await getUserId(userName);
            if (id) {
                router.replace(`?userId=${id}` + (otherParams ? `&${otherParams}` : ''));
            }
        } catch (error) {
            console.error('Error during sign in:', error);
        }
    };

    const handleSignOut = () => {
        console.log('Signing out:', userName);
        console.log(otherParams)
        router.replace(`?${otherParams}`);
    };

    return (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', textAlign: 'right' }}>
            {!searchParams.userId && <input
                style={{ width: '150px', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0)' }}
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter username"
            />}
            {!searchParams.userId && <button onClick={handleSignUp} style={{ margin: '5px', color: 'white' }}>Sign Up</button>}
            {!searchParams.userId && <button onClick={handleSignIn} style={{ margin: '5px', color: 'white' }}>Sign In</button>}
            {searchParams.userId && <p>Welcome {userName}!<button style={{ margin: '5px', color: 'white' }} onClick={handleSignOut}>Sign Out</button></p>}
        </div>
    );
};

export default User;
