import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import Spinner from '../components/Spinner';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getPosts();
        setPosts(response.data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" />
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
      <div className="text-center py-10">
        <h2 className="text-2xl mb-4">No Posts Found</h2>
        <p className="mb-4">There are currently no blog posts available.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
          >
            {post.image_url && (
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
                  }}
                />
              </div>
            )}
            
            <div className="p-5 flex-grow flex flex-col">
              <div className="flex items-center mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {post.category || 'Uncategorized'}
                </span>
                <span className="text-gray-500 text-sm ml-auto">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <h2 className="text-xl font-bold mb-2 hover:text-blue-600">
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </h2>
              
              <p className="text-gray-700 mb-4 flex-grow line-clamp-3">
                {post.content?.substring(0, 150)}
                {post.content?.length > 150 ? '...' : ''}
              </p>
              
              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">By {post.author || 'Unknown'}</span>
                <Link 
                  to={`/post/${post.id}`} 
                  className="text-blue-500 hover:underline text-sm font-medium"
                >
                  Read More
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Home; 