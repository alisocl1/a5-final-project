import React, { useEffect, useState } from 'react';
import './overlay-menu.css';

function Overlay({ onNavigate, isMenuVisible }) {
    const [isSlidingOut, setIsSlidingOut] = useState(false);

    useEffect(() => {
        if (!isMenuVisible) {
            setIsSlidingOut(true);
        }

        const timer = setTimeout(() => {
            setIsSlidingOut(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [isMenuVisible]);

    if (!isMenuVisible && !isSlidingOut) {
        return null; // Completely remove the menu from the DOM
    }

    return (
        <div>
            {/* black overlay */}
            <div
                className={`overlay-menu ${isMenuVisible ? '' : 'fade-out'}`}
            ></div>

            {/* page options */}
            <div className="page-options">
                <div className={`page ${isMenuVisible ? '' : 'slide-out'}`} onClick={() => onNavigate('name')}>name</div>
                <div className={`page ${isMenuVisible ? '' : 'slide-out'}`} onClick={() => onNavigate('location')}>location</div>
            </div>
        </div>
    );   
};

export default Overlay;
