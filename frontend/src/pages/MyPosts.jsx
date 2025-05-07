import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiFilter, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useAppAuth } from '../services/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';
import './MyPosts.css';

const MyPosts = () => {
  const { isAuthor, userProfile } = useAppAuth();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, published, draft
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  
  // Fetch author's posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getAuthorPosts();
        setPosts(response.data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load your posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Filter posts based on status
  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'published') return post.status === 'published';
    if (filter === 'draft') return post.status === 'draft';
    return true;
  });
  
  // Handle post deletion
  const handleDeletePost = async (postId) => {
    if (!postId) return;
    
    try {
      setDeleteLoading(true);
      await api.deletePost(postId);
      
      // Remove post from state
      setPosts(posts.filter(post => post.id !== postId));
      setStatusMessage({ type: 'success', text: 'Post deleted successfully' });
      
      // Clear status message after 3 seconds
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting post:', err);
      setStatusMessage({ type: 'error', text: 'Failed to delete post' });
    } finally {
      setDeleteLoading(false);
      setDeleteConfirm(null);
    }
  };
  
  // Navigate to create post page
  const handleNewPost = () => {
    navigate('/edit');
  };
  
  if (!isAuthor) {
    return (
      <div className="not-authorized">
        <FiAlertCircle className="icon" />
        <h2>Not Authorized</h2>
        <p>You don't have permission to manage posts.</p>
        <Link to="/" className="link-home">Return to Home</Link>
      </div>
    );
  }
  
  return (
    <motion.div
      className="my-posts-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="page-header">
        <div className="title-section">
          <h1>My Posts</h1>
          <p>Create and manage your blog posts</p>
        </div>
        
        <button 
          className="create-post-btn"
          onClick={handleNewPost}
        >
          <FiPlus className="icon" />
          Create New Post
        </button>
      </div>
      
      {statusMessage && (
        <div className={`status-message ${statusMessage.type}`}>
          {statusMessage.type === 'success' ? (
            <FiCheckCircle className="icon" />
          ) : (
            <FiAlertCircle className="icon" />
          )}
          {statusMessage.text}
        </div>
      )}
      
      <div className="filter-controls">
        <div className="filter-label">
          <FiFilter className="icon" />
          <span>Filter:</span>
        </div>
        
        <div className="filter-options">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={filter === 'published' ? 'active' : ''}
            onClick={() => setFilter('published')}
          >
            Published
          </button>
          <button 
            className={filter === 'draft' ? 'active' : ''}
            onClick={() => setFilter('draft')}
          >
            Drafts
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <Spinner />
          <p>Loading your posts...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <FiAlertCircle className="icon" />
          <p>{error}</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-posts">
          <p>
            {filter === 'all' 
              ? "You haven't created any posts yet." 
              : `You don't have any ${filter} posts.`
            }
          </p>
          <button 
            className="create-post-btn"
            onClick={handleNewPost}
          >
            <FiPlus className="icon" />
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map(post => (
            <div key={post.id} className="post-card">
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
                
                <div className="post-status">
                  {post.status === 'published' ? (
                    <span className="status published">
                      <FiCheckCircle className="icon" />
                      Published
                    </span>
                  ) : (
                    <span className="status draft">
                      <FiClock className="icon" />
                      Draft
                    </span>
                  )}
                </div>
              </div>
              
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-date">
                  Created: {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="post-excerpt">
                  {post.content.substring(0, 100)}
                  {post.content.length > 100 ? '...' : ''}
                </p>
              </div>
              
              <div className="post-actions">
                <Link 
                  title="View post"
                  className="action-btn view-btn"
                  to={`/posts/${post.id}`}
                >
                  <FiEye size={16} />
                </Link>
                <Link
                  title="Edit post" 
                  className="action-btn edit-btn"
                  to={`/edit/${post.id}`}
                >
                  <FiEdit2 size={16} />
                </Link>
                <button 
                  className="delete-btn" 
                  onClick={() => setDeleteConfirm(post.id)}
                  title="Delete Post"
                >
                  <FiTrash2 />
                </button>
              </div>
              
              {deleteConfirm === post.id && (
                <div className="delete-confirm">
                  <p>Are you sure you want to delete this post?</p>
                  <div className="confirm-actions">
                    <button 
                      className="cancel-btn"
                      onClick={() => setDeleteConfirm(null)}
                      disabled={deleteLoading}
                    >
                      Cancel
                    </button>
                    <button 
                      className="confirm-btn"
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyPosts; 