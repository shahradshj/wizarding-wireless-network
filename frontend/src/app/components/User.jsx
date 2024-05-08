'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { addUser, getUserId, getUserName } from '../helpers/apiHelpers';

const User = ({ searchParams }) => {
    const router = useRouter();
    const params = new URLSearchParams(searchParams);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (searchParams.userId) {
            getUserName(searchParams.userId).then(name => {
                if (name) {
                    setUserName(name);
                }
                else {
                    params.delete('userId');
                    router.replace(`?${params}`);
                }
            }).catch(console.error);
        }
    }, []);

    const handleSignUp = async () => {
        console.log('Signing up:', userName);
        try {
            const id = await addUser(userName);
            if (id) {
                params.set('userId', id);
                router.replace(`?${params}`);
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
                params.set('userId', id);
                router.replace(`?${params}`);
            }
        } catch (error) {
            console.error('Error during sign in:', error);
        }
    };

    const handleSignOut = () => {
        console.log('Signing out:', userName);
        params.delete('userId');
        router.replace(`?${params}`);
        router.refresh();
    };

    return (
        <div className="user-container">
            {!searchParams.userId && (
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
            {!searchParams.userId && (
                <button className="user-button" onClick={handleSignUp}>
                    Sign Up
                </button>
            )}
            {!searchParams.userId && (
                <button className="user-button" onClick={handleSignIn}>
                    Sign In
                </button>
            )}
            {searchParams.userId && (
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
