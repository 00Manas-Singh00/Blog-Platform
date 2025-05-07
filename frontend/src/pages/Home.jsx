import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/api';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';
import { FiBookOpen, FiLoader } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="loading-container"
      >
        <FiLoader className="loading-spinner" />
        <p>Loading posts...</p>
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

  return (
    <motion.div 
      className="home-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={headerVariants} className="home-header">
        <FiBookOpen className="header-icon" />
        <h1>All Blog Posts</h1>
      </motion.div>
      
      {posts.length === 0 ? (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No posts found.
        </motion.p>
      ) : (
        <ul className="post-list">
          {posts.map((post, index) => (
            <motion.li 
              key={post.id} 
              className="post-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }
              }}
            >
              <PostCard
                id={post.id}
                title={post.title}
                excerpt={post.excerpt || post.content?.slice(0, 100) + '...'}
                author={post.author}
                date={post.created_at ? new Date(post.created_at).toLocaleDateString() : ''}
                category={post.category}
                tags={post.tags}
              />
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default Home; 