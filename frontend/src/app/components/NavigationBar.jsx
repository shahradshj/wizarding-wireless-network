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
    <nav className="navbar">
      {navOptions.map(option => {

        const linkClass = `nav-link ${option.toLocaleLowerCase() === params.get('navigation') ? 'active' : 'inactive'}`;

        return (
          <Link
            href={`${setNav(option)}`}
            key={option}
            scroll={true}
            className={linkClass}
          >
            {option}
          </Link>
        );
      })}
    </nav>
  );
}

export default NavigationBar;
