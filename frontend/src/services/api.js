import axios from 'axios';

// API Base URL - Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Flag to toggle between mock data and real API
const USE_MOCK_DATA = true;

// Mock data for development
const MOCK_DATA = {
  posts: [
    {
      id: 1,
      title: 'Getting Started with React',
      content: 'React is a popular JavaScript library for building user interfaces. It was developed by Facebook and has gained wide adoption in the web development community. React allows developers to create reusable UI components that can update efficiently when data changes.',
      image_url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
      category: 'Technology',
      author: 'John Doe',
      created_at: '2023-05-15',
      updated_at: '2023-05-16'
    },
    {
      id: 2,
      title: 'The Art of Photography',
      content: 'Photography is the art, application, and practice of creating images by recording light, either electronically by means of an image sensor, or chemically by means of a light-sensitive material such as photographic film.',
      image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
      category: 'Arts',
      author: 'Jane Smith',
      created_at: '2023-05-10',
      updated_at: '2023-05-11'
    },
    {
      id: 3,
      title: 'Healthy Eating Habits',
      content: 'A healthy diet is essential for good health and nutrition. It protects you against many chronic noncommunicable diseases, such as heart disease, diabetes and cancer. Eating a variety of foods and consuming less salt, sugars and saturated and industrially-produced trans-fats, are essential for healthy diet.',
      image_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352',
      category: 'Health',
      author: 'Mike Johnson',
      created_at: '2023-05-05',
      updated_at: '2023-05-07'
    }
  ],
  categories: [
    { id: 1, name: 'Technology', slug: 'technology' },
    { id: 2, name: 'Arts', slug: 'arts' },
    { id: 3, name: 'Health', slug: 'health' },
    { id: 4, name: 'Science', slug: 'science' },
    { id: 5, name: 'Travel', slug: 'travel' }
  ],
  users: [
    {
      id: 1,
      username: 'johndoe',
      email: 'john@example.com',
      full_name: 'John Doe',
      bio: 'Technology enthusiast and blogger',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      role: 'admin'
    },
    {
      id: 2,
      username: 'janesmith',
      email: 'jane@example.com',
      full_name: 'Jane Smith',
      bio: 'Professional photographer and writer',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      role: 'author'
    }
  ]
};

// API instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for handling error messages
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

// Mock API functions
const mockAPI = {
  async get(endpoint) {
    console.log(`MOCK API GET: ${endpoint}`);
    const parts = endpoint.split('/').filter(Boolean);
    
    if (parts[0] === 'posts') {
      if (parts.length === 1) {
        return { data: MOCK_DATA.posts };
      } else if (parts.length === 2) {
        const postId = parseInt(parts[1]);
        const post = MOCK_DATA.posts.find(p => p.id === postId);
        return { data: post || null };
      }
    }
    
    if (parts[0] === 'categories') {
      return { data: MOCK_DATA.categories };
    }
    
    if (parts[0] === 'users') {
      if (parts.length === 1) {
        return { data: MOCK_DATA.users };
      } else if (parts.length === 2) {
        const userId = parseInt(parts[1]);
        const user = MOCK_DATA.users.find(u => u.id === userId);
        return { data: user || null };
      }
    }
    
    return { data: null };
  },

  async post(endpoint, data) {
    console.log(`MOCK API POST: ${endpoint}`, data);
    if (endpoint === 'posts') {
      const newPost = {
        id: MOCK_DATA.posts.length + 1,
        ...data,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      };
      MOCK_DATA.posts.push(newPost);
      return { data: newPost };
    }
    return { data: { success: true } };
  },

  async put(endpoint, data) {
    console.log(`MOCK API PUT: ${endpoint}`, data);
    const parts = endpoint.split('/').filter(Boolean);
    
    if (parts[0] === 'posts' && parts.length === 2) {
      const postId = parseInt(parts[1]);
      const postIndex = MOCK_DATA.posts.findIndex(p => p.id === postId);
      
      if (postIndex !== -1) {
        MOCK_DATA.posts[postIndex] = {
          ...MOCK_DATA.posts[postIndex],
          ...data,
          updated_at: new Date().toISOString().split('T')[0]
        };
        return { data: MOCK_DATA.posts[postIndex] };
      }
    }
    
    return { data: { success: true } };
  },

  async delete(endpoint) {
    console.log(`MOCK API DELETE: ${endpoint}`);
    const parts = endpoint.split('/').filter(Boolean);
    
    if (parts[0] === 'posts' && parts.length === 2) {
      const postId = parseInt(parts[1]);
      const postIndex = MOCK_DATA.posts.findIndex(p => p.id === postId);
      
      if (postIndex !== -1) {
        MOCK_DATA.posts.splice(postIndex, 1);
        return { data: { success: true } };
      }
    }
    
    return { data: { success: true } };
  }
};

// Export API methods with mock handling
export default {
  getPosts: () => 
    USE_MOCK_DATA ? mockAPI.get('posts') : api.get('/posts'),
  
  getPost: (id) => 
    USE_MOCK_DATA ? mockAPI.get(`posts/${id}`) : api.get(`/posts/${id}`),
  
  createPost: (postData) => 
    USE_MOCK_DATA ? mockAPI.post('posts', postData) : api.post('/posts', postData),
  
  updatePost: (id, postData) => 
    USE_MOCK_DATA ? mockAPI.put(`posts/${id}`, postData) : api.put(`/posts/${id}`, postData),
  
  deletePost: (id) => 
    USE_MOCK_DATA ? mockAPI.delete(`posts/${id}`) : api.delete(`/posts/${id}`),
  
  getCategories: () => 
    USE_MOCK_DATA ? mockAPI.get('categories') : api.get('/categories'),
  
  getUserProfile: (userId) => 
    USE_MOCK_DATA ? mockAPI.get(`users/${userId}`) : api.get(`/users/${userId}`),
  
  updateUserProfile: (userId, profileData) => 
    USE_MOCK_DATA ? mockAPI.put(`users/${userId}`, profileData) : api.put(`/users/${userId}`, profileData),
}; 