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

const API_BASE_URL = 'http://localhost:8000/api'; // Adjust as needed for your backend

// Use this flag to toggle between mock data and real API
const USE_MOCK_DATA = true;

export const getPosts = async () => {
  if (USE_MOCK_DATA) {
    // Return mock data
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_POSTS), 500); // Simulate network delay
    });
  } else {
    // Use real API
    const response = await axios.get(`${API_BASE_URL}/posts`);
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
    const response = await axios.get(`${API_BASE_URL}/posts/${id}`);
    return response.data;
  }
}; 