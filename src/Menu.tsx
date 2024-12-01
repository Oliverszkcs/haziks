import React from 'react';
import './Menu.css';

interface MenuProps {
    onThemeChange: () => void;
    onLogout: () => void;
}

const Menu: React.FC<MenuProps> = ({ onThemeChange, onLogout }) => {
    return (
        <div className="menu">
            <button className="theme-toggle-button" onClick={onThemeChange}>Change Theme</button>
            <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>
    );
};

export default Menu;