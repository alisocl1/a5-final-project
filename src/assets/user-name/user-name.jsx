import React from 'react';
import './user-name.css'

const UserNameInput = ({ userName, setUserName, onNext }) => {
    return (
        <div className="name-input-container">
            <h1>welcome to spacedump!</h1>
            <div className="name-input-row">
                <label htmlFor="user-name-input" className="sr-only">enter your first name</label>
                <input
                    id="user-name-input"
                    type="text"
                    className = "line-input"
                    placeholder="what's your name?"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <button
                    className={`next-button ${userName.trim() ? 'active' : ''}`}
                    onClick={onNext}
                    disabled={!userName.trim()}
                >
                    → 
                </button>
            </div>
        </div>
    );
};

export default UserNameInput;
