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
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', textAlign: 'right' }}>
            {!searchParams.userId && <input
                style={{ width: '150px', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0)' }}
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onSubmit={(e) => { e.preventDefault(); console.log("on submit", e); handleSignIn(); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSignIn(); } }}
                placeholder="Enter username"
            />}
            {!searchParams.userId && <button onClick={handleSignUp} style={{ margin: '5px', color: 'white' }}>Sign Up</button>}
            {!searchParams.userId && <button onClick={handleSignIn} style={{ margin: '5px', color: 'white' }}>Sign In</button>}
            {searchParams.userId && <p>Welcome {userName}!<button style={{ margin: '5px', color: 'white' }} onClick={handleSignOut}>Sign Out</button></p>}
        </div>
    );
};

export default User;
