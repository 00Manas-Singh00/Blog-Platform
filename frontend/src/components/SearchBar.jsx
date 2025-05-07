import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (query.trim()) {
      // Navigate to search results page with query as parameter
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsExpanded(false);
    }
  };
  
  // Toggle search bar expansion
  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Close search bar on click outside
  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setIsExpanded(false);
    }
  };
  
  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);
  
  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className={`search-bar ${isExpanded ? 'expanded' : ''}`} ref={inputRef}>
      {isExpanded ? (
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="search-input"
          />
          <button 
            type="button" 
            className="search-close-btn"
            onClick={toggleSearch}
          >
            <FiX />
          </button>
          <button type="submit" className="search-submit-btn">
            <FiSearch />
          </button>
        </form>
      ) : (
        <button className="search-icon-btn" onClick={toggleSearch}>
          <FiSearch />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
