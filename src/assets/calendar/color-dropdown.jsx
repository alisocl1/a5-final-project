import React, { useState, useEffect, useRef } from "react";
import "./color-dropdown.css";

const ColorDropdown = ({ onColorSelect }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#4770ac");
    const dropdownRef = useRef(null);
    const modalRef = useRef(null);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
        if (
            modalRef.current && !modalRef.current.contains(event.target) &&
            dropdownRef.current && !dropdownRef.current.contains(event.target)
        ) {
            setIsModalOpen(false);
        }
        };

        // Add event listener
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
            <div class="triangle">⏷</div>


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
