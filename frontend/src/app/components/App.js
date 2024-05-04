
import React from 'react';

import NavigationBar from './NavigationBar';
import User from './User';
import Movies from './Movies';

export default function App({ searchParams, }) {
    const navigation = searchParams.navigation || '';
    return (
        <div>
            <User searchParams={searchParams}/>
            <NavigationBar searchParams={searchParams}/>
            {navigation === 'Movies' && <Movies />}
        </div>
    );
}