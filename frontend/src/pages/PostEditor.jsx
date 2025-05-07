import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSave, FiEyeOff, FiCheck, FiX, FiArrowLeft, FiUpload, FiImage, FiAlertCircle } from 'react-icons/fi';
import { useAppAuth } from '../services/AuthContext';
import api from '../services/api';
import Spinner from '../components/Spinner';
import './PostEditor.css';

const PostEditor = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { isAuthor, userProfile } = useAppAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    image_url: '',
    status: 'draft'
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  // Fetch categories on mount
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
  
  // If editing, fetch the post data
  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await api.getPost(id);
          
          if (!response.data) {
            throw new Error('Post not found');
          }
          
          // Update form data with post info
          setFormData({
            title: response.data.title || '',
            content: response.data.content || '',
            category_id: response.data.category_id || '',
            image_url: response.data.image_url || '',
            status: response.data.status || 'draft'
          });
          
          // Set image preview if image exists
          if (response.data.image_url) {
            setImagePreview(response.data.image_url);
          }
        } catch (err) {
          console.error('Error fetching post:', err);
          setError('Failed to load post. It might have been deleted or you may not have permission to edit it.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchPost();
    }
  }, [id, isEditMode]);
  
  // Check if user is authorized
  if (!isAuthor) {
    return (
      <div className="not-authorized">
        <FiAlertCircle className="icon" />
        <h2>Not Authorized</h2>
        <p>You don't have permission to create or edit posts.</p>
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          <FiArrowLeft className="icon" />
          Return to Home
        </button>
      </div>
    );
  }
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    const fileType = file.type;
    if (!fileType.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      setError('Please upload an image file (JPEG, PNG, or GIF)');
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image file size must be less than 2MB');
      return;
    }
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Store file for upload
    setImageFile(file);
  };
  
  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setFormData(prev => ({
      ...prev,
      image_url: ''
    }));
  };
  
  // Save as draft
  const handleSaveDraft = (e) => {
    e.preventDefault();
    savePost('draft');
  };
  
  // Publish post
  const handlePublish = (e) => {
    e.preventDefault();
    savePost('published');
  };
  
  // Save post (draft or published)
  const savePost = async (status) => {
    // Validate form
    if (!formData.title.trim()) {
      setError('Please enter a title for your post');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Please enter content for your post');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Update status
      const postData = {
        ...formData,
        status
      };
      
      let response;
      
      // If we have a new image file, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadResponse = await api.uploadImage(formData);
        if (uploadResponse.data && uploadResponse.data.image_url) {
          postData.image_url = uploadResponse.data.image_url;
        }
      }
      
      // Create or update post
      if (isEditMode) {
        response = await api.updatePost(id, postData);
      } else {
        response = await api.createPost(postData);
      }
      
      // Show success message
      const actionType = isEditMode ? 'updated' : 'created';
      const statusType = status === 'published' ? 'published' : 'saved as a draft';
      
      setSuccessMessage(`Post ${actionType} and ${statusType} successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
        
        // Redirect to the post detail page if published, or my posts if draft
        if (status === 'published' && response.data && response.data.id) {
          setStatus('success');
          setTimeout(() => {
            navigate(`/posts/${response.data.id}`);
          }, 1500);
        } else {
          navigate('/my-posts');
        }
      }, 3000);
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Cancel editing and go back
  const handleCancel = () => {
    navigate(-1);
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <Spinner />
        <p>Loading post data...</p>
      </div>
    );
  }
  
  return (
    <motion.div
      className="post-editor-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="editor-header">
        <h1>{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
        <div className="editor-actions">
          <button
            className="cancel-button"
            onClick={handleCancel}
            disabled={submitting}
          >
            <FiX className="icon" />
            Cancel
          </button>
          <button
            className="draft-button"
            onClick={handleSaveDraft}
            disabled={submitting}
          >
            <FiEyeOff className="icon" />
            {submitting ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            className="publish-button"
            onClick={handlePublish}
            disabled={submitting}
          >
            <FiCheck className="icon" />
            {submitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
      
      {successMessage && (
        <div className="success-message">
          <FiCheck className="icon" />
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <FiAlertCircle className="icon" />
          {error}
        </div>
      )}
      
      <form className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title for your post"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category_id">Category</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Featured Image</label>
          <div className="image-upload-container">
            {imagePreview ? (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={handleRemoveImage}
                >
                  <FiX className="icon" />
                </button>
              </div>
            ) : (
              <div className="upload-area">
                <label htmlFor="image-upload" className="upload-label">
                  <FiImage className="icon" />
                  <span>Click to upload image</span>
                  <small>JPG, PNG, GIF (Max 2MB)</small>
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                  hidden
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content here..."
            rows="12"
            required
          ></textarea>
        </div>
      </form>
    </motion.div>
  );
};

export default PostEditor; 