'use client'

import React, { useState } from 'react';

import { addUser, getUserId } from '../helpers/apiHelpers';

const User = ({ setUserId }) => {
    const [userName, setUserName] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleSignUp = async () => {
        console.log('Signing up:', userName);
        try {
            const id = await addUser(userName);
            setUserId(id);
            setLoggedIn(true);
        } catch (error) {
            console.error('Error during sign up:', error);
        }
    };

    const handleSignIn = async () => {
        console.log('Signing in:', userName);
        try {
            const id = await getUserId(userName);
            setUserId(id);
            setLoggedIn(true);
        } catch (error) {
            console.error('Error during sign in:', error);
        }
    };

    return (
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'flex-end' }}>
            {!loggedIn && <input
                style={{ width: '150px', color: 'white', backgroundColor: 'rgba(0, 0, 0, 0)', border: '1px solid white', borderRadius: '5px', padding: '5px', margin: '5px'}}
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter username"
            />}
            {!loggedIn && <button onClick={handleSignUp} style={{ margin: '5px', color: 'white' }}>Sign Up</button>}
            {!loggedIn && <button onClick={handleSignIn} style={{ margin: '5px', color: 'white' }}>Sign In</button>}
            {loggedIn && <p>Welcome {userName}!<button style={{ margin: '5px', color: 'white' }} onClick={() => { setUserId(''); setLoggedIn(false) }}>Sign Out</button></p>}
        </div>
    );
};

export default User;
