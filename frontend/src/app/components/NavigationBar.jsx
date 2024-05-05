import React from 'react';
import Link from 'next/link';

function NavigationBar({ searchParams }) {
  const navOptions = ['Movies', 'Suggestions', 'Series', 'Favorites', 'Collections', 'Genres'];
  const params = new URLSearchParams(searchParams);
  const setNav = (option) => {
    params.set('navigation', option.toLowerCase());
    return '?' + params;
  }
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
          href={`${setNav(option)}`}
          key={option}
          scroll={true}
          style={{ color: '#fff', textDecoration: 'none' }}>
          {option}
        </Link>
      ))
      }
    </nav >
  );
}

export default NavigationBar;
