import React from "react";
import "./styles/Menu.css";

interface MenuProps {
  onThemeChange: () => void;
  onLogout: () => void;
  onAddNewBook: () => void;
}
/**
 * Ez a menu komponens.
 * @param onThemeChange A tema valtas esemenykezeloje.
 * @param onLogout A kijelentkezes esemenykezeloje.
 * @param onAddNewBook Az uj konyv hozzadasanak esemenykezeloje.
 * @returns visszaadja a menu html kodjat.
 */
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
