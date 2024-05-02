import React from 'react';
import './NavigationBar.css'; // Import the CSS file for styling

function NavigationBar(props) {
  const navOptions = ['Movies', 'Suggestions', 'Series', 'Favorites', 'Collections', 'Genres'];

  return (
    <nav className="navigation-bar">
      {navOptions.map(option => (
        <button key={option} className="nav-option" onClick={() => props.changeNavigation(option)}>
          {option}
        </button>
      ))}
    </nav>
  );
}

export default NavigationBar;
