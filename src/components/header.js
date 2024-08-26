import React, { useState, useEffect } from 'react';
import '../styles/header.css';

const Header = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    function handleResize() {
      const isMobile = window.innerWidth <= 590;
      setIsMenuVisible(!isMobile);
    }

    function handleClickOutside(event) {
      if (isDropdownVisible && !event.target.closest('.dropdown-menu') && !event.target.closest('.menu-toggle')) {
        setIsDropdownVisible(false);
      }
    }

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownVisible]);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleItemClick = (url) => {
    window.open(url, '_blank');
    setIsDropdownVisible(false);
  };

  return (
    <div className="header">
      <div className="left-section">
        {isMenuVisible && (
          <div className="menu-items">
            <a href="https://www.alexandramarieharris.com/" target="_blank" rel="noopener noreferrer" className="header-link">Portfolio</a>
            <span className="divider"></span>
            <a href="https://www.github.com/alexandramharris" target="_blank" rel="noopener noreferrer" className="header-link">GitHub</a>
            <span className="divider"></span>
            <a href="https://www.linkedin.com/in/alexandra-marie-harris" target="_blank" rel="noopener noreferrer" className="header-link">LinkedIn</a>
          </div>
        )}
      </div>
      <div className="right-section">
        <div className="menu-toggle" onClick={toggleDropdown}>
          <div className={`hamburger ${isDropdownVisible ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      {isDropdownVisible && (
        <>
          <div className="overlay" onClick={toggleDropdown}></div>
          <div className="dropdown-menu">
            <div className="close-icon" onClick={toggleDropdown}>&times;</div>
            <span className="dropdown-item" onClick={() => handleItemClick('https://www.alexandramarieharris.com/')}>Portfolio</span>
            <span className="dropdown-item" onClick={() => handleItemClick('https://www.github.com/alexandramharris')}>GitHub</span>
            <span className="dropdown-item" onClick={() => handleItemClick('https://www.linkedin.com/in/alexandra-marie-harris')}>LinkedIn</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
