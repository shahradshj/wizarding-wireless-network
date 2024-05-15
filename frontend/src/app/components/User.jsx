'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { addUser, getUserId, getUserName } from '../helpers/apiHelpers';

const User = ({ searchParams }) => {
    const router = useRouter();
    const urlSearchParams = new URLSearchParams(searchParams);
    const [userName, setUserName] = useState('');
    const userId = urlSearchParams.get('userId');

    useEffect(() => {
        if (userId) {
            getUserName(userId).then(name => {
                if (name) {
                    setUserName(name);
                }
                else {
                    urlSearchParams.delete('userId');
                    router.replace(`?${urlSearchParams}`);
                }
            }).catch(console.error);
        }
    }, []);

    const handleSignUp = async () => {
        console.log('Signing up:', userName);
        try {
            const id = await addUser(userName);
            if (id) {
                urlSearchParams.set('userId', id);
                router.replace(`?${urlSearchParams}`);
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
                urlSearchParams.set('userId', id);
                router.replace(`?${urlSearchParams}`);
            }
        } catch (error) {
            console.error('Error during sign in:', error);
        }
    };

    const handleSignOut = () => {
        console.log('Signing out:', userName);
        urlSearchParams.delete('userId');
        router.replace(`?${urlSearchParams}`);
        router.refresh();
    };

    return (
        <div className="user-container">
            {!urlSearchParams.has('userId') && (
                <input
                    className="user-input"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log("on submit", e);
                        handleSignIn();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSignIn();
                        }
                    }}
                    placeholder="Enter username"
                />
            )}
            {!urlSearchParams.has('userId') && (
                <button className="user-button" onClick={handleSignUp}>
                    Sign Up
                </button>
            )}
            {!urlSearchParams.has('userId') && (
                <button className="user-button" onClick={handleSignIn}>
                    Sign In
                </button>
            )}
            {urlSearchParams.has('userId') && (
                <p className='user-paragraph'>
                    Welcome {userName}!
                    <button className="user-button" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </p>
            )}
        </div>
    );
};

export default User;
