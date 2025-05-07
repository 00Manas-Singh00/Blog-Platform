import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronRight, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import api from '../services/api';
import Spinner from '../components/Spinner';
import './Categories.css';

const Categories = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'title'
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getCategories();
        setCategories(response.data || []);
        
        // If slug is provided, set active category
        if (slug) {
          const category = response.data.find(c => c.slug === slug);
          if (category) {
            setActiveCategory(category);
          } else {
            navigate('/categories');
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      }
    };
    
    fetchCategories();
  }, [slug, navigate]);
  
  // Fetch posts when active category changes
  useEffect(() => {
    const fetchPosts = async () => {
      if (!activeCategory) {
        setPosts([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // In a real app, this would be a call to filter posts by category
        // For now, we'll filter the mock data
        const response = await api.getPosts();
        const filteredPosts = response.data.filter(post => 
          post.category === activeCategory.name || 
          post.category_id === activeCategory.id
        );
        
        setPosts(filteredPosts || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts for this category. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [activeCategory]);
  
  // Handle category selection
  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    navigate(`/categories/${category.slug}`);
  };
  
  // Sort posts based on sortBy state
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  return (
    <motion.div
      className="categories-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="categories-header">
        <h1>Categories</h1>
        <p>Browse posts by category</p>
      </div>
      
      <div className="categories-content">
        <div className="categories-sidebar">
          <h2>All Categories</h2>
          <ul className="category-list">
            {categories.map(category => (
              <li 
                key={category.id} 
                className={`category-item ${activeCategory?.id === category.id ? 'active' : ''}`}
                onClick={() => handleCategorySelect(category)}
              >
                <span>{category.name}</span>
                <FiChevronRight className="icon" />
              </li>
            ))}
          </ul>
        </div>
        
        <div className="categories-main">
          {activeCategory ? (
            <>
              <div className="category-info">
                <h2>{activeCategory.name}</h2>
                {activeCategory.description && (
                  <p className="category-description">{activeCategory.description}</p>
                )}
              </div>
              
              <div className="posts-controls">
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
                
                <div className="sort-controls">
                  <FiFilter className="icon" />
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="loading-container">
                  <Spinner />
                  <p>Loading posts...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p>{error}</p>
                </div>
              ) : sortedPosts.length === 0 ? (
                <div className="no-posts">
                  <p>No posts found in this category.</p>
                </div>
              ) : (
                <div className={`posts-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                  {sortedPosts.map(post => (
                    <motion.div 
                      key={post.id} 
                      className="post-card"
                      whileHover={{ y: -5 }}
                    >
                      <div className="post-image">
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
                      <div className="post-content">
                        <h3 className="post-title">
                          <Link to={`/posts/${post.id}`}>{post.title}</Link>
                        </h3>
                        <p className="post-meta">
                          By {post.author} • {new Date(post.created_at).toLocaleDateString()}
                        </p>
                        <p className="post-excerpt">
                          {post.content.substring(0, 120)}
                          {post.content.length > 120 ? '...' : ''}
                        </p>
                        <Link to={`/posts/${post.id}`} className="read-more">
                          Read more
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="select-category">
              <h2>Select a category</h2>
              <p>Choose a category from the sidebar to view related posts.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Categories; 