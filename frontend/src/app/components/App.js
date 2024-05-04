'use client'

import React, { useState } from 'react';

import NavigationBar from './NavigationBar';
import User from './User';

export default function App({ children }) {
    return (
        <div>
            <User setUserId={(id) => console.log(id)} />
            <NavigationBar changeNavigation={(option) => { console.log(option) }} />
            {children.movies}
        </div>
    );
}