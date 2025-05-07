import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi';
import api from '../services/api';
import Spinner from '../components/Spinner';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'relevance' // 'relevance', 'newest', 'oldest'
  });
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Fetch categories for filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Perform search when query or filters change
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Use our new searchPosts method with filters
        const response = await api.searchPosts(searchQuery, {
          category: filters.category,
          sortBy: filters.sortBy
        });
        
        setResults(response.data || []);
      } catch (err) {
        console.error('Error searching posts:', err);
        setError('Failed to search posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    performSearch();
  }, [searchQuery, filters]);
  
  // Handle form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.searchInput.value.trim();
    
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  // Update filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: '',
      sortBy: 'relevance'
    });
  };
  
  // Toggle filter panel on mobile
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  return (
    <motion.div 
      className="search-results-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="search-header">
        <h1>Search Results</h1>
        
        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              name="searchInput"
              defaultValue={searchQuery}
              placeholder="Search posts..."
              className="search-input"
            />
          </div>
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
      
      <div className="search-content">
        {/* Filters */}
        <div className="filter-toggle" onClick={toggleFilters}>
          <FiFilter className="icon" />
          <span>Filters</span>
        </div>
        
        <aside className={`search-filters ${isFilterOpen ? 'open' : ''}`}>
          <div className="filters-header">
            <h2>Filters</h2>
            <button 
              className="close-filters"
              onClick={toggleFilters}
            >
              <FiX />
            </button>
          </div>
          
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sortBy">Sort By</label>
            <select
              id="sortBy"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          
          <button 
            className="clear-filters"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </aside>
        
        {/* Results section */}
        <div className="results-section">
          <div className="results-header">
            <p className="results-count">
              {loading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
            </p>
            
            <div className="view-controls">
              <button 
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <FiGrid className="icon" />
              </button>
              <button 
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <FiList className="icon" />
              </button>
            </div>
          </div>
          
          {/* Results display */}
          {loading ? (
            <div className="loading-container">
              <Spinner />
              <p>Searching for "{searchQuery}"...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="no-results">
              <h2>No results found</h2>
              <p>
                {searchQuery
                  ? `No posts matching "${searchQuery}" were found.`
                  : 'Please enter a search term to find posts.'
                }
              </p>
              {searchQuery && (
                <div className="search-suggestions">
                  <h3>Suggestions:</h3>
                  <ul>
                    <li>Check if your search term is spelled correctly</li>
                    <li>Try using different or more general keywords</li>
                    <li>Try searching in a specific category</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className={`search-results ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
              {results.map(post => (
                <motion.div 
                  key={post.id} 
                  className="result-card"
                  whileHover={{ y: -5 }}
                >
                  <div className="result-image">
                    {post.image_url ? (
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="result-content">
                    <div className="result-category">
                      {post.category || 'Uncategorized'}
                    </div>
                    <h3 className="result-title">
                      <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="result-meta">
                      By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <p className="result-excerpt">
                      {post.content.substring(0, 150)}
                      {post.content.length > 150 ? '...' : ''}
                    </p>
                    <Link to={`/posts/${post.id}`} className="read-more">
                      Read more
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchResults;
