import React, { useEffect, useState } from 'react';
import './overlay-menu.css';

const Overlay = ({ onNavigate, isMenuVisible }) => {
    return (
      <div className={`overlay ${isMenuVisible ? "visible" : ""}`}>
        <nav className="menu">
          <ul>
            <li onClick={() => onNavigate('name')}>name</li>
            <li onClick={() => onNavigate('location')}>location</li>
          </ul>
        </nav>
      </div>
    );
  };
  
  export default Overlay;
