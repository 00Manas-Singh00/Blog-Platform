import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser, useAuth } from '@clerk/clerk-react';
import { FiPlus, FiEdit, FiTrash, FiCheck, FiX } from 'react-icons/fi';
import './AdminPanel.css';
import { getPosts, createPost, deletePost } from '../services/api';

const AdminPanel = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: ''
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data.records || []);
      } catch (err) {
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.content) {
      alert('Title and content are required');
      return;
    }
    
    try {
      // Prepare tags data
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      // Use API function instead of direct fetch
      const result = await createPost(postData);
      
      // Reset form and update post list
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: ''
      });
      setShowForm(false);
      
      // Refresh post list
      const updatedPosts = await getPosts();
      setPosts(updatedPosts.records || []);
      
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    
    try {
      // Use API function instead of direct fetch
      await deletePost(postId);
      
      // Remove post from list
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <motion.div 
      className="admin-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.fullName || user.username || user.primaryEmailAddress?.emailAddress}</p>
      </div>
      
      <div className="admin-actions">
        <button 
          className="new-post-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <><FiX /> Cancel</> : <><FiPlus /> New Post</>}
        </button>
      </div>
      
      {showForm && (
        <motion.div 
          className="post-form"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h2>Create New Post</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="excerpt">Excerpt (optional)</label>
              <input
                type="text"
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="10"
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g. React, JavaScript, Web Development"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                <FiCheck /> Create Post
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                <FiX /> Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      <div className="posts-management">
        <h2>Manage Posts</h2>
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <table className="posts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.category || 'Uncategorized'}</td>
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="post-actions">
                    <button className="edit-btn">
                      <FiEdit /> Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <FiTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default AdminPanel;