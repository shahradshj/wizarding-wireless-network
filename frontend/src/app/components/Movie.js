import React from 'react';
import './tiles.css'; 

export default async function Movie({ movie }) {
  return (
    <div className='title'>
      <img src={`http://wizardingwireless.network:8080/poster/${movie.id}`} alt={movie.name} className="poster" />
      <div className="info">
        <h2 className="name">{movie.name}</h2>
        <p className="year">{movie.year}</p>
      </div>
    </div>
  );
}

