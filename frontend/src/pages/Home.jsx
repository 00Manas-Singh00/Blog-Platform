import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiArrowRight, FiBookOpen, FiGrid, FiFilter } from 'react-icons/fi';
import api from '../services/api';
import Spinner from '../components/Spinner';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch posts
        const postsResponse = await api.getPosts();
        setPosts(postsResponse.data || []);
        setFilteredPosts(postsResponse.data || []);
        
        // Fetch categories
        const categoriesResponse = await api.getCategories();
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  
  // Filter posts by category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => 
        post.category?.toLowerCase() === activeCategory.toLowerCase()
      ));
    }
  }, [activeCategory, posts]);

  // Handle category selection
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner size="large" className="loading-spinner" />
        <p>Loading amazing content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl text-red-600 mb-4">Error</h2>
        <p className="mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="no-posts-message">
        <h2>No Posts Found</h2>
        <p>There are currently no blog posts available. Check back later for new content!</p>
      </div>
    );
  }
  
  // Get featured posts (first 3 posts)
  const featuredPosts = posts.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="home-container"
    >
      <div className="home-header">
        <h1>Discover Inspiring Stories</h1>
        <p>Explore our collection of thoughtful articles, tutorials, and insights across various topics.</p>
        <div className="header-decoration"></div>
      </div>
      
      {/* Category filters */}
      <div className="categories-list">
        <div 
          className={`category-chip ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('all')}
        >
          All Posts
        </div>
        
        {categories.map(category => (
          <div 
            key={category.id} 
            className={`category-chip ${activeCategory === category.name ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.name)}
          >
            {category.name}
          </div>
        ))}
      </div>
      
      {/* Featured posts section */}
      {activeCategory === 'all' && (
        <div className="featured-posts">
          <h2 className="section-title">
            <FiBookOpen className="icon" />
            Featured Articles
          </h2>
          
          <div className="post-grid">
            {featuredPosts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ y: -5 }}
                className="post-card"
              >
                {post.image_url && (
                  <div className="post-image">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
                      }}
                    />
                    <div className="post-category">{post.category || 'Uncategorized'}</div>
                  </div>
                )}
                
                <div className="post-content">
                  <div className="post-date">
                    <FiCalendar className="icon" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  
                  <h3 className="post-title">
                    <Link to={`/posts/${post.id}`} className="text-gray-800">{post.title}</Link>
                  </h3>
                  
                  <p className="post-excerpt">
                    {post.content?.substring(0, 120)}
                    {post.content?.length > 120 ? '...' : ''}
                  </p>
                  
                  <div className="post-footer">
                    <div className="post-author">
                      <span>By {post.author || 'Unknown'}</span>
                    </div>
                    
                    <Link to={`/posts/${post.id}`} className="read-more">
                      Read More
                      <FiArrowRight className="icon" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      {/* All posts or filtered posts */}
      <div className="all-posts">
        <h2 className="section-title">
          <FiGrid className="icon" />
          {activeCategory === 'all' ? 'All Posts' : `${activeCategory} Posts`}
        </h2>
        
        {filteredPosts.length === 0 ? (
          <div className="no-posts-message">
            <p>No posts found in the "{activeCategory}" category.</p>
          </div>
        ) : (
          <div className="post-grid">
            {filteredPosts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ y: -5 }}
                className="post-card"
              >
                {post.image_url && (
                  <div className="post-image">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
                      }}
                    />
                    <div className="post-category">{post.category || 'Uncategorized'}</div>
                  </div>
                )}
                
                <div className="post-content">
                  <div className="post-date">
                    <FiCalendar className="icon" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  
                  <h3 className="post-title">
                    <Link to={`/posts/${post.id}`}>{post.title}</Link>
                  </h3>
                  
                  <p className="post-excerpt">
                    {post.content?.substring(0, 120)}
                    {post.content?.length > 120 ? '...' : ''}
                  </p>
                  
                  <div className="post-footer">
                    <div className="post-author">
                      <span>By {post.author || 'Unknown'}</span>
                    </div>
                    
                    <Link to={`/posts/${post.id}`} className="read-more">
                      Read More
                      <FiArrowRight className="icon" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Home; 