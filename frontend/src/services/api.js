import axios from 'axios';

// Mock data for development
const MOCK_POSTS = [
  {
    id: 1,
    title: "Getting Started with React",
    content: "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called \"components\". React has a few different kinds of components, but we'll start with React.Component subclasses.",
    excerpt: "Learn the basics of React and how to create your first component.",
    author: "Jane Doe",
    created_at: "2024-06-01T10:30:00Z",
    category: "Frontend",
    tags: ["React", "JavaScript", "Web Development"]
  },
  {
    id: 2,
    title: "PHP REST API Best Practices",
    content: "Building a REST API with PHP requires attention to several details. This post covers authentication, routing, response formatting, error handling, and more to help you build robust and secure APIs.",
    excerpt: "Learn how to build secure and scalable REST APIs with PHP.",
    author: "John Smith",
    created_at: "2024-05-25T14:15:00Z",
    category: "Backend",
    tags: ["PHP", "API", "REST"]
  },
  {
    id: 3,
    title: "Styling with CSS-in-JS",
    content: "CSS-in-JS libraries allow you to write CSS directly in your JavaScript code. This approach offers several benefits like scoped styling, dynamic styling based on props, and more. This post explores the popular libraries and how to use them effectively.",
    excerpt: "Modern approaches to styling your React applications.",
    author: "Alex Johnson",
    created_at: "2024-05-20T09:45:00Z",
    category: "Design",
    tags: ["CSS", "React", "Styling"]
  }
];

// API Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Use this flag to toggle between mock data and real API
// Set to false to use the real API with your backend
const USE_MOCK_DATA = true;

// Helper to get auth headers if user is logged in
const getAuthHeaders = async () => {
  if (window.Clerk && window.Clerk.session) {
    try {
      const token = await window.Clerk.session.getToken();
      return {
        'Authorization': `Bearer ${token}`
      };
    } catch (err) {
      console.error('Error getting auth token:', err);
    }
  } else if (window.Clerk) {
    try {
      // Try to get active session
      const session = await window.Clerk.getSession();
      if (session) {
        const token = await session.getToken();
        return {
          'Authorization': `Bearer ${token}`
        };
      }
    } catch (err) {
      console.error('Error getting session:', err);
    }
  }
  return {};
};

export const getPosts = async () => {
  if (USE_MOCK_DATA) {
    // Return mock data
    return new Promise(resolve => {
      setTimeout(() => resolve({ records: MOCK_POSTS }), 500); // Simulate network delay
    });
  } else {
    // Use real API with auth if available
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/posts/read.php`, { headers });
    return response.data;
  }
};

export const getPostById = async (id) => {
  if (USE_MOCK_DATA) {
    // Return mock data for the specific ID
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const post = MOCK_POSTS.find(p => p.id === parseInt(id));
        if (post) {
          resolve(post);
        } else {
          reject(new Error("Post not found"));
        }
      }, 500); // Simulate network delay
    });
  } else {
    // Use real API
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/posts/read_one.php?id=${id}`, { headers });
    return response.data;
  }
};

export const createPost = async (postData) => {
  if (USE_MOCK_DATA) {
    // Simulate creating a post
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "Post was created." });
      }, 500);
    });
  } else {
    // Use real API with auth
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_BASE_URL}/posts/create.php`, postData, { 
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
};

export const updatePost = async (postData) => {
  if (USE_MOCK_DATA) {
    // Simulate updating a post
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "Post was updated." });
      }, 500);
    });
  } else {
    // Use real API with auth
    const headers = await getAuthHeaders();
    const response = await axios.put(`${API_BASE_URL}/posts/update.php`, postData, { 
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  }
};

export const deletePost = async (postId) => {
  if (USE_MOCK_DATA) {
    // Simulate deleting a post
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "Post was deleted." });
      }, 500);
    });
  } else {
    // Use real API with auth
    const headers = await getAuthHeaders();
    const response = await axios.delete(`${API_BASE_URL}/posts/delete.php`, { 
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      data: { id: postId }
    });
    return response.data;
  }
}; 