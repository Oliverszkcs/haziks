import React from "react";
import "./styles/Menu.css";

interface MenuProps {
  onThemeChange: () => void;
  onLogout: () => void;
  onAddNewBook: () => void;
}

const Menu: React.FC<MenuProps> = ({
  onThemeChange,
  onLogout,
  onAddNewBook,
}) => {
  return (
    <div className="menu">
      <button className="theme-toggle-button" onClick={onThemeChange}>
        Change Theme
      </button>
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
      <button className="theme-toggle-button" onClick={onAddNewBook}>
        Add New Book
      </button>
    </div>
  );
};

export default Menu;
