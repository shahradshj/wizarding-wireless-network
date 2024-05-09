import React from 'react';
import Link from 'next/link';

function NavigationBar({ urlSearchParams }) {
  const navOptions = ['Movies', 'Suggestions', 'Series', 'Favorites', 'Collections', 'Genres'];
  const setNav = (option) => {
    const newParams = new URLSearchParams(urlSearchParams);
    newParams.set('navigation', option.toLowerCase());
    return '?' + newParams;
  }
  
  return (
    <nav className="navbar">
      {navOptions.map(option => {

        const linkCSSClass = `nav-link ${option.toLocaleLowerCase() === urlSearchParams.get('navigation') ? 'active' : 'inactive'}`;

        return (
          <Link
            href={`${setNav(option)}`}
            key={option}
            scroll={true}
            className={linkCSSClass}
          >
            {option}
          </Link>
        );
      })}
    </nav>
  );
}

export default NavigationBar;
