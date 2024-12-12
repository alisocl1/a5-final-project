import React, { useState } from 'react';
import './menu-button.css'

const MenuButton = ( { onButtonClick } ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [spinTo, setSpinTo] = useState(false);

    const handleButtonClick = () => {
        setIsOpen(!isOpen);
        setSpinTo(true);
        onButtonClick();
    };

    return (
        <div className="menu-container">
            <button 
                className={`menu-button ${isOpen ? 'spin-to' : spinTo ? 'spin-back' : ''}`}
                onClick={handleButtonClick}
                aria-expanded={isOpen}
                aria-label="toggle menu"
            >
                <div className="menu-icon"></div>
                <div className="menu-icon"></div>
                <div className="menu-icon"></div>

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
            </button>
        </div>
    )
};

export default MenuButton;
