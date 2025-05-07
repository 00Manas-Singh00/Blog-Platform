import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import Spinner from '../components/Spinner';
import Comments from '../components/Comments';
import { FiUser, FiCalendar, FiFolder, FiTag, FiArrowLeft, FiShare2, FiTwitter, FiFacebook, FiLink } from 'react-icons/fi';
import './PostDetail.css';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getPost(postId);
        if (!response.data) {
          throw new Error('Post not found');
        }
        setPost(response.data);
        
        // Fetch related posts based on category
        if (response.data.category) {
          const postsResponse = await api.getPosts();
          const related = postsResponse.data
            .filter(p => p.category === response.data.category && p.id !== response.data.id)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    // Scroll to top when component mounts or postId changes
    window.scrollTo(0, 0);
  }, [postId]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || 'Check out this post';
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          alert('Link copied to clipboard!');
        });
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner className="loading-spinner" />
        <p>Loading article...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="error-message">
        <h2>Post Not Found</h2>
        <p>The post you're looking for doesn't exist or has been removed.</p>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }

  // Format date
  const formattedDate = post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="post-detail"
    >
      <Link to="/" className="back-link">
        <FiArrowLeft className="back-icon" />
        Back to Blog
      </Link>
      
      <div className="post-detail-header">
        <div className="post-image-container">
          <img 
            src={post.image_url || 'https://via.placeholder.com/1200x600?text=BlogZilla'} 
            alt={post.title} 
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1200x600?text=BlogZilla';
            }}
          />
        </div>
        
        {post.category && (
          <div className="post-category">
            <FiFolder className="mr-1" />
            {post.category}
          </div>
        )}
        
        <h1 className="post-detail-title">{post.title}</h1>
        
        <div className="post-detail-meta">
          <span>
            <FiUser className="meta-icon" />
            {post.author || 'Unknown Author'}
          </span>
          <span>
            <FiCalendar className="meta-icon" />
            {formattedDate}
          </span>
          {post.tags && post.tags.length > 0 && (
            <span>
              <FiTag className="meta-icon" />
              {post.tags.join(', ')}
            </span>
          )}
        </div>
      </div>
      
      <div className="post-author-info">
        <img 
          src={post.author_avatar || 'https://via.placeholder.com/60x60?text=A'} 
          alt={post.author} 
          className="author-avatar"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/60x60?text=A';
          }}
        />
        <div className="author-details">
          <div className="author-name">{post.author || 'Unknown Author'}</div>
          <p className="author-bio">
            {post.author_bio || 'A passionate writer who loves sharing knowledge and insights.'}
          </p>
        </div>
      </div>
      
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ 
          __html: post.content?.replace(
            /<(p|h1|h2|h3|h4|h5|h6|li|span|div)(?![^>]*style=)/g, 
            '<$1 style="color: #000000;"'
          ) || ''
        }} 
      />
      
      <div className="share-section">
        <h3 className="share-title">Share this article</h3>
        <div className="share-buttons">
          <button onClick={() => handleShare('twitter')} className="share-button">
            <FiTwitter />
          </button>
          <button onClick={() => handleShare('facebook')} className="share-button">
            <FiFacebook />
          </button>
          <button onClick={() => handleShare('copy')} className="share-button">
            <FiLink />
          </button>
        </div>
      </div>
      
      {relatedPosts.length > 0 && (
        <div className="related-posts">
          <h3 className="related-posts-title">Related Articles</h3>
          <div className="related-posts-grid">
            {relatedPosts.map(relatedPost => (
              <motion.div 
                key={relatedPost.id}
                whileHover={{ y: -5 }}
                className="post-card"
              >
                <div className="post-image">
                  <img 
                    src={relatedPost.image_url || 'https://via.placeholder.com/400x250?text=BlogZilla'} 
                    alt={relatedPost.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x250?text=BlogZilla';
                    }}
                  />
                  <div className="post-category">{relatedPost.category}</div>
                </div>
                <div className="post-content">
                  <h3 className="post-title">
                    <Link to={`/posts/${relatedPost.id}`}>{relatedPost.title}</Link>
                  </h3>
                  <p className="post-excerpt" style={{ color: "#000000" }}>
                    {relatedPost.content?.substring(0, 100)}
                    {relatedPost.content?.length > 100 ? '...' : ''}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      
      <div className="comments-section">
        <Comments postId={post.id} />
      </div>
    </motion.div>
  );
};

export default PostDetail; 