import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiCalendar, FiFolder, FiTag } from 'react-icons/fi';
import './PostCard.css';

const PostCard = ({ id, title, excerpt, author, date, category, tags }) => {
  return (
    <motion.div 
      className="post-card"
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <h2 className="post-card-title">
        <Link to={`/posts/${id}`}>{title}</Link>
      </h2>
      <div className="post-card-meta">
        <span>
          <FiUser className="meta-icon" />
          {author || 'Unknown'}
        </span> 
        {date && (
          <span>
            <FiCalendar className="meta-icon" />
            {date}
          </span>
        )}
        {category && (
          <span>
            <FiFolder className="meta-icon" />
            {category}
          </span>
        )}
      </div>
      <p className="post-card-excerpt">{excerpt}</p>
      {tags && tags.length > 0 && (
        <div className="post-card-tags">
          <FiTag className="tags-icon" />
          {tags.map(tag => (
            <motion.span 
              key={tag} 
              className="post-card-tag"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      )}
      <motion.div 
        className="post-card-readmore"
        whileHover={{ x: 5 }}
      >
        <Link to={`/posts/${id}`}>Read more →</Link>
      </motion.div>
    </motion.div>
  );
};

export default PostCard; 