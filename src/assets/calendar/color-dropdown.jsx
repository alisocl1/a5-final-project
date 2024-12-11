import React, { useState } from "react";
import "./color-dropdown.css";

const ColorDropdown = ({ onColorSelect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#4770ac");

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

  return (
    <div className="color-dropdown">
      <div
        title="Select event color."
        onClick={toggleModal}
        className="color-circle"
        style={{ backgroundColor: selectedColor }}
      ></div>

      {isModalOpen && (
        <div className="color-modal">
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
