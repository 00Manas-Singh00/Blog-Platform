import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPostById } from '../services/api';
import { FiUser, FiCalendar, FiFolder, FiTag, FiArrowLeft, FiLoader } from 'react-icons/fi';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="loading-container"
      >
        <FiLoader className="loading-spinner" />
        <p>Loading post...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="error-message"
      >
        <p>{error}</p>
      </motion.div>
    );
  }

  if (!post) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="error-message"
      >
        <p>Post not found.</p>
      </motion.div>
    );
  }

  // Format date
  const formattedDate = post.created_at ? new Date(post.created_at).toLocaleString() : '';

  return (
    <motion.div 
      className="post-detail-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="back-link">
        <FiArrowLeft className="back-icon" />
        Back to all posts
      </Link>
      
      <motion.h1 
        className="post-detail-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {post.title}
      </motion.h1>
      
      <motion.div 
        className="post-detail-meta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <span>
          <FiUser className="meta-icon" />
          {post.author || 'Unknown'}
        </span>
        <span>
          <FiCalendar className="meta-icon" />
          {formattedDate}
        </span>
        {post.category && (
          <span>
            <FiFolder className="meta-icon" />
            {post.category}
          </span>
        )}
      </motion.div>
      
      {post.tags && post.tags.length > 0 && (
        <motion.div 
          className="post-detail-tags"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <FiTag className="tags-icon" />
          {post.tags.map(tag => (
            <span key={tag} className="post-detail-tag">
              {tag}
            </span>
          ))}
        </motion.div>
      )}
      
      <motion.div 
        className="post-detail-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </motion.div>
  );
};

export default PostDetail; 