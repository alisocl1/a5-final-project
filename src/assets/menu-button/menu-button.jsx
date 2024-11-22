import React, { useState } from 'react';
import './menu-button.css'

const MenuButton = ( { onButtonClick } ) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleButtonClick = () => {
        setIsOpen(!isOpen);
        onButtonClick();
    };

    return (
        <div className="menu-container">
            <button 
                className={`menu-button ${isOpen ? 'spin' : ''}`}
                onClick={handleButtonClick}
            >
                <svg
                    className="menu-border"
                    viewBox="0 0 100 100"
                >
                    <circle 
                        className={`menu-circle ${isOpen ? 'animate-in' : 'animate-out'}`}
                        cx="50" 
                        cy="50" 
                        r="47" 
                    />
                </svg>
                <div className="menu-icon"></div>
                <div className="menu-icon"></div>
                <div className="menu-icon"></div>
            </button>
        </div>
    )
};

export default MenuButton;
