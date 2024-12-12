import React, { useState, useEffect, useRef } from "react";
import "./color-dropdown.css";

// Color Selector for events
const ColorDropdown = ({ onColorSelect, currentColor }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(currentColor || "#4770ac");
    const dropdownRef = useRef(null);
    const modalRef = useRef(null);

    // Prechosen palette
    const colorSamples = [
        "#d44c4c", "#d6792d", "#ebd247", "#80cc8a", "#15813e",
        "#4fa5c7", "#4770ac", "#836bc5", "#bd76c4", "#525252"
    ];

    const toggleModal = () => setIsModalOpen((prev) => !prev);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setIsModalOpen(false);
        if (onColorSelect) onColorSelect(color);
    };

    // clicking outside closes the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (
            modalRef.current && !modalRef.current.contains(event.target) &&
            dropdownRef.current && !dropdownRef.current.contains(event.target)
        ) {
            setIsModalOpen(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);

        // Clean up event listener on component unmount
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleModalClick = (event) => {
        event.stopPropagation();
    };


    return (
        <div className="color-dropdown" onClick={toggleModal} title="Select event color." ref={dropdownRef}>
            <div className="color-circle" style={{ backgroundColor: selectedColor }}></div>
            <div className="triangle">⏷</div>


        {isModalOpen && (
            <div className="color-modal" ref={modalRef} onClick={handleModalClick}>
            {colorSamples.map((color) => (
                <div
                key={color}
                onClick={() => handleColorSelect(color)}
                className="color-sample"
                style={{ backgroundColor: color }}
                ></div>
            ))}
            </div>
        )}
        </div>
    );
};

export default ColorDropdown;
