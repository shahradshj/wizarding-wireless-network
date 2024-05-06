import React from 'react';
import Link from 'next/link';

function NavigationBar({ searchParams }) {
  const navOptions = ['Movies', 'Suggestions', 'Series', 'Favorites', 'Collections', 'Genres'];
  const params = new URLSearchParams(searchParams);
  const setNav = (option) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('navigation', option.toLowerCase());
    return '?' + newParams;
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
          style={{
            color: '#fff', padding: '5px', border: '1px solid', borderRadius: '5px',
            borderColor: (option.toLocaleLowerCase() === params.get('navigation') ? 'white' : 'rgba(0,0,0,0)')
          }}>
          {option}
        </Link>
      ))}
    </nav >
  );
}

export default NavigationBar;
