import React from 'react';
import Link from 'next/link';

function NavigationBar({ searchParams }) {
  const navOptions = ['Movies', 'Suggestions', 'Series', 'Favorites', 'Collections', 'Genres'];
  const otherParams = Object.keys(searchParams).filter(key => key !== 'navigation').map(key => `${key}=${searchParams[key]}`).join('&');
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-around',
      padding: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: '#fff'
    }}>
      {navOptions.map(option => (
        <Link
          href={`/?navigation=${option}` + (otherParams ? `&${otherParams}` : '')}
          key={option}
          style={{ color: '#fff', textDecoration: 'none' }}>
          {option}
        </Link>
      ))
      }
    </nav >
  );
}

export default NavigationBar;
