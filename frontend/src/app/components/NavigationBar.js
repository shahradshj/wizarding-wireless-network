import React from 'react';

function NavigationBar(props) {
  const navOptions = ['Movies', 'Suggestions', 'Series', 'Favorites', 'Collections', 'Genres'];

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-around',
      padding: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: '#fff'
    }}>
      {navOptions.map(option => (
        <button
          key={option}
          style={{ color: '#fff', textDecoration: 'none' }}
          onClick={() => props.changeNavigation(option)}>
          {option}
        </button>
      ))}
    </nav>
  );
}

export default NavigationBar;
