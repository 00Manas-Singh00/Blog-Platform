import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { FiUser, FiCalendar, FiFolder, FiTag, FiArrowLeft } from 'react-icons/fi';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getPost(id);
        if (!response.data) {
          throw new Error('Post not found');
        }
        setPost(response.data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl text-red-600 mb-4">Error</h2>
        <p className="mb-4">{error}</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl mb-4">Post Not Found</h2>
        <p className="mb-4">The post you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  // Format date
  const formattedDate = post.created_at ? new Date(post.created_at).toLocaleString() : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="post-detail container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {post.image_url && (
          <div className="w-full h-64 sm:h-96 overflow-hidden">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
              }}
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {post.category}
            </span>
            <span className="text-gray-500 text-sm ml-4">
              {formattedDate}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          
          <div className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
            {post.content}
          </div>
          
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center">
              <span className="text-gray-700">By {post.author || 'Unknown'}</span>
            </div>
            
            <Link to="/" className="text-blue-500 hover:underline">
              Back to Posts
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetail; 