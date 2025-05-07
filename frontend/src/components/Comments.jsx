import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiClock, FiMessageSquare, FiSend } from 'react-icons/fi';
import api from '../services/api';
import './Comments.css';

// Single comment component with reply functionality
const Comment = ({ comment, onReply, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const formattedDate = new Date(comment.created_at).toLocaleString();
  
  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };
  
  const handleSubmitReply = (content) => {
    onReply(content, comment.id);
    setShowReplyForm(false);
  };
  
  return (
    <motion.div 
      className={`comment ${level > 0 ? 'comment-reply' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ marginLeft: `${level * 25}px` }}
    >
      <div className="comment-header">
        <div className="comment-user">
          <FiUser className="icon" />
          <span>{comment.author_name}</span>
        </div>
        <div className="comment-date">
          <FiClock className="icon" />
          <span>{formattedDate}</span>
        </div>
      </div>
      
      <div className="comment-content">
        {comment.content}
      </div>
      
      <div className="comment-actions">
        <button 
          className="reply-button"
          onClick={toggleReplyForm}
        >
          <FiMessageSquare className="icon" />
          Reply
        </button>
      </div>
      
      {showReplyForm && (
        <CommentForm onSubmit={handleSubmitReply} isReply />
      )}
    </motion.div>
  );
};

// Comment form component
const CommentForm = ({ onSubmit, isReply = false }) => {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setLoading(true);
    onSubmit({
      content,
      author_name: authorName.trim() || 'Anonymous'
    });
    
    // Reset form
    setContent('');
    setLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className={`comment-form ${isReply ? 'reply-form' : ''}`}>
      {!isReply && (
        <div className="form-group mb-3">
          <label htmlFor="authorName" className="form-label">Your Name</label>
          <input
            type="text"
            id="authorName"
            className="form-control"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your Name (optional)"
          />
        </div>
      )}
      
      <div className="form-group mb-3">
        <label htmlFor="content" className="form-label">
          {isReply ? 'Your Reply' : 'Your Comment'}
        </label>
        <textarea
          id="content"
          className="form-control"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isReply ? 'Write your reply...' : 'Write your comment...'}
          rows={isReply ? 2 : 4}
          required
        />
      </div>
      
      <button 
        type="submit" 
        className="submit-button"
        disabled={loading || !content.trim()}
      >
        <FiSend className="icon" />
        {isReply ? 'Reply' : 'Post Comment'}
      </button>
    </form>
  );
};

// Main Comments component
const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await api.getCommentsByPost(postId);
        
        // Organize comments into a hierarchical structure
        const rootComments = [];
        const commentMap = {};
        
        // First pass: Create a map of all comments
        response.data.forEach(comment => {
          commentMap[comment.id] = {
            ...comment,
            replies: []
          };
        });
        
        // Second pass: Organize into parent-child relationships
        response.data.forEach(comment => {
          if (comment.parent_id) {
            // This is a reply, add it to its parent's replies
            if (commentMap[comment.parent_id]) {
              commentMap[comment.parent_id].replies.push(commentMap[comment.id]);
            }
          } else {
            // This is a root comment
            rootComments.push(commentMap[comment.id]);
          }
        });
        
        setComments(rootComments);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    
    fetchComments();
  }, [postId]);
  
  // Submit a new comment
  const handleSubmitComment = async (commentData) => {
    try {
      const response = await api.createComment({
        post_id: postId,
        ...commentData,
        parent_id: null
      });
      
      // Add new comment to the list
      setComments([
        ...comments,
        {
          ...response.data,
          replies: []
        }
      ]);
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment');
    }
  };
  
  // Submit a reply to a comment
  const handleSubmitReply = async (replyData, parentId) => {
    try {
      const response = await api.createComment({
        post_id: postId,
        content: replyData.content,
        author_name: replyData.author_name,
        parent_id: parentId
      });
      
      // Find the parent comment and add the reply
      const newComments = JSON.parse(JSON.stringify(comments));
      
      // Helper function to recursively find and update the parent comment
      const addReplyToParent = (commentsArray, parentId) => {
        for (let i = 0; i < commentsArray.length; i++) {
          if (commentsArray[i].id === parentId) {
            commentsArray[i].replies.push({
              ...response.data,
              replies: []
            });
            return true;
          }
          
          if (commentsArray[i].replies.length > 0) {
            if (addReplyToParent(commentsArray[i].replies, parentId)) {
              return true;
            }
          }
        }
        return false;
      };
      
      addReplyToParent(newComments, parentId);
      setComments(newComments);
    } catch (err) {
      console.error('Error posting reply:', err);
      setError('Failed to post reply');
    }
  };
  
  // Recursive function to render comments and their replies
  const renderComments = (commentsArray, level = 0) => {
    return commentsArray.map(comment => (
      <React.Fragment key={comment.id}>
        <Comment 
          comment={comment} 
          onReply={(content, parentId) => handleSubmitReply(content, parentId)}
          level={level}
        />
        {comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
      </React.Fragment>
    ));
  };
  
  return (
    <div className="comments-section">
      <h2 className="section-title">
        <FiMessageSquare className="icon" />
        Comments
      </h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <CommentForm onSubmit={handleSubmitComment} />
      
      <div className="comments-list">
        {loading ? (
          <div className="loading-message">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments-message">No comments yet. Be the first to comment!</div>
        ) : (
          renderComments(comments)
        )}
      </div>
    </div>
  );
};

export default Comments; 