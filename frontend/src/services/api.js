import axios from 'axios';

// API Base URL - Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Flag to toggle between mock data and real API
const USE_MOCK_DATA = true;

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

// Authentication helpers
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('auth_token', token);
  }
};

const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('auth_token');
};

// Load token from localStorage on init if available
const loadStoredToken = () => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    setAuthToken(token);
    return token;
  }
  return null;
};

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
  ],
  comments: [
    {
      id: 1,
      post_id: 1,
      user_id: 1,
      author_name: 'John Doe',
      content: 'Great article about React! I found it very informative.',
      parent_id: null,
      is_approved: 1,
      created_at: '2023-05-16T10:30:00'
    },
    {
      id: 2,
      post_id: 1,
      user_id: 2,
      author_name: 'Jane Smith',
      content: 'Thanks for sharing this. I learned a lot about React components.',
      parent_id: null,
      is_approved: 1,
      created_at: '2023-05-16T11:45:00'
    },
    {
      id: 3,
      post_id: 1,
      user_id: null,
      author_name: 'Guest User',
      content: 'I have a question about React hooks. Could you explain them more?',
      parent_id: null,
      is_approved: 1,
      created_at: '2023-05-17T08:15:00'
    },
    {
      id: 4,
      post_id: 1,
      user_id: 1,
      author_name: 'John Doe',
      content: 'Sure! React hooks let you use state and other React features without writing classes.',
      parent_id: 3,
      is_approved: 1,
      created_at: '2023-05-17T09:30:00'
    }
  ],
  profile: {
    id: 1,
    clerk_id: 'user_1234567890',
    display_name: 'John Doe',
    bio: 'Technology enthusiast and blogger',
    website: 'https://example.com',
    avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
    email: 'john@example.com',
    roles: ['author'],
    social_links: [
      { platform: 'twitter', url: 'https://twitter.com/johndoe' },
      { platform: 'github', url: 'https://github.com/johndoe' }
    ],
    created_at: '2023-01-15',
    updated_at: '2023-05-10'
  },
  authorPosts: [
    {
      id: 1,
      title: 'Getting Started with React',
      content: 'React is a popular JavaScript library for building user interfaces. It was developed by Facebook and has gained wide adoption in the web development community. React allows developers to create reusable UI components that can update efficiently when data changes.',
      image_url: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
      category_id: 1,
      category: 'Technology',
      author: 'John Doe',
      status: 'published',
      created_at: '2023-05-15',
      updated_at: '2023-05-16'
    },
    {
      id: 4,
      title: 'Understanding Modern JavaScript',
      content: 'JavaScript has evolved significantly over the years. This post explores modern JavaScript features like arrow functions, destructuring, and async/await.',
      image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      category_id: 1,
      category: 'Technology',
      author: 'John Doe',
      status: 'draft',
      created_at: '2023-05-20',
      updated_at: '2023-05-20'
    },
    {
      id: 5,
      title: 'Building Responsive UIs',
      content: 'In this post, we will explore techniques for building responsive user interfaces that work well on all device sizes.',
      image_url: '',
      category_id: 1,
      category: 'Technology',
      author: 'John Doe',
      status: 'draft',
      created_at: '2023-05-22',
      updated_at: '2023-05-22'
    }
  ]
};

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
      } else if (parts.length === 3 && parts[2] === 'comments') {
        const postId = parseInt(parts[1]);
        const comments = MOCK_DATA.comments.filter(c => c.post_id === postId);
        return { data: comments || [] };
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
    
    if (parts[0] === 'profile') {
      console.log('Returning mock profile data');
      return { data: MOCK_DATA.profile };
    }
    
    if (parts[0] === 'author' && parts[1] === 'posts') {
      return { data: MOCK_DATA.authorPosts };
    }
    
    if (parts[0] === 'search') {
      const url = new URL(`http://example.com/${endpoint}`);
      const query = url.searchParams.get('q') || '';
      
      if (!query.trim()) {
        return { data: [] };
      }
      
      // Basic search implementation - find posts that match the query in title or content
      const results = MOCK_DATA.posts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) || 
        post.content.toLowerCase().includes(query.toLowerCase())
      );
      
      return { data: results };
    }
    
    return { data: null };
  },

  async post(endpoint, data) {
    console.log(`MOCK API POST: ${endpoint}`, data);
    if (endpoint === 'posts') {
      const newPost = {
        id: Math.max(...MOCK_DATA.posts.map(p => p.id), ...MOCK_DATA.authorPosts.map(p => p.id)) + 1,
        ...data,
        author: 'John Doe',
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      };
      
      if (data.status === 'published') {
        MOCK_DATA.posts.push(newPost);
      }
      
      MOCK_DATA.authorPosts.push(newPost);
      return { data: newPost };
    }
    
    if (endpoint === 'comments') {
      const newComment = {
        id: MOCK_DATA.comments.length + 1,
        ...data,
        is_approved: 1, // Auto-approve in mock
        created_at: new Date().toISOString()
      };
      MOCK_DATA.comments.push(newComment);
      return { data: newComment };
    }
    
    if (endpoint === 'images/upload') {
      // Mock image upload - return a fake URL
      return {
        data: {
          image_url: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}`
        }
      };
    }
    
    return { data: { success: true } };
  },

  async put(endpoint, data) {
    console.log(`MOCK API PUT: ${endpoint}`, data);
    const parts = endpoint.split('/').filter(Boolean);
    
    if (parts[0] === 'posts' && parts.length === 2) {
      const postId = parseInt(parts[1]);
      const postIndex = MOCK_DATA.posts.findIndex(p => p.id === postId);
      const authorPostIndex = MOCK_DATA.authorPosts.findIndex(p => p.id === postId);
      
      const updatedPost = {
        ...data,
        id: postId,
        updated_at: new Date().toISOString().split('T')[0]
      };
      
      // Update in author posts
      if (authorPostIndex !== -1) {
        MOCK_DATA.authorPosts[authorPostIndex] = {
          ...MOCK_DATA.authorPosts[authorPostIndex],
          ...updatedPost
        };
      }
      
      // Update in main posts if published
      if (data.status === 'published') {
        if (postIndex !== -1) {
          MOCK_DATA.posts[postIndex] = {
            ...MOCK_DATA.posts[postIndex],
            ...updatedPost
          };
        } else {
          // Add to main posts if newly published
          MOCK_DATA.posts.push(updatedPost);
        }
      } else {
        // Remove from main posts if unpublished
        if (postIndex !== -1) {
          MOCK_DATA.posts.splice(postIndex, 1);
        }
      }
      
      return { data: updatedPost };
    }
    
    if (parts[0] === 'profile') {
      // Update mock profile
      MOCK_DATA.profile = {
        ...MOCK_DATA.profile,
        ...data,
        updated_at: new Date().toISOString().split('T')[0]
      };
      return { data: MOCK_DATA.profile };
    }
    
    return { data: { success: true } };
  },

  async delete(endpoint) {
    console.log(`MOCK API DELETE: ${endpoint}`);
    const parts = endpoint.split('/').filter(Boolean);
    
    if (parts[0] === 'posts' && parts.length === 2) {
      const postId = parseInt(parts[1]);
      const postIndex = MOCK_DATA.posts.findIndex(p => p.id === postId);
      const authorPostIndex = MOCK_DATA.authorPosts.findIndex(p => p.id === postId);
      
      // Remove from main posts if exists
      if (postIndex !== -1) {
        MOCK_DATA.posts.splice(postIndex, 1);
      }
      
      // Remove from author posts
      if (authorPostIndex !== -1) {
        MOCK_DATA.authorPosts.splice(authorPostIndex, 1);
      }
      
      return { data: { success: true } };
    }
    
    return { data: { success: true } };
  }
};

// Export API methods with mock handling
export default {
  // Authentication methods
  setAuthToken,
  clearAuthToken,
  loadStoredToken,

  getPosts: () => 
    USE_MOCK_DATA ? mockAPI.get('posts') : api.get('/posts'),
  
  getPost: (id) => 
    USE_MOCK_DATA ? mockAPI.get(`posts/${id}`) : api.get(`/posts/${id}`),
  
  createPost: (postData) => 
    USE_MOCK_DATA ? mockAPI.post('posts', postData) : api.post('/posts/create.php', postData),
  
  updatePost: (id, postData) => 
    USE_MOCK_DATA ? mockAPI.put(`posts/${id}`, postData) : api.put(`/posts/${id}`, postData),
  
  deletePost: (id) => 
    USE_MOCK_DATA ? mockAPI.delete(`posts/${id}`) : api.delete(`/posts/${id}`),
  
  getCategories: () => 
    USE_MOCK_DATA ? mockAPI.get('categories') : api.get('/categories'),
  
  getUserProfile: async () => {
    if (USE_MOCK_DATA) {
      console.log('Using mock profile data');
      return mockAPI.get('profile');
    }
    return api.get('/users/profile');
  },
  
  updateUserProfile: (profileData) => 
    USE_MOCK_DATA ? mockAPI.put('profile', profileData) : api.put('/users/update_profile.php', profileData),
  
  uploadAvatar: (imageData) =>
    USE_MOCK_DATA ? mockAPI.post('avatar/upload', imageData) : api.post('/users/upload_avatar.php', imageData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    
  updateProfileSettings: (settingsData) =>
    USE_MOCK_DATA ? mockAPI.put('profile/settings', settingsData) : api.put('/users/update_settings.php', settingsData),
    
  // Comment related API methods
  getCommentsByPost: (postId) => 
    USE_MOCK_DATA ? mockAPI.get(`posts/${postId}/comments`) : api.get(`/comments/read_by_post.php?post_id=${postId}`),
  
  createComment: (commentData) => 
    USE_MOCK_DATA ? mockAPI.post('comments', commentData) : api.post('/comments/create.php', commentData),
  
  moderateComment: (commentId, action) => 
    USE_MOCK_DATA ? { data: { success: true } } : api.post('/comments/moderate.php', { comment_id: commentId, action }),
  
  // Author post management methods
  getAuthorPosts: () => 
    USE_MOCK_DATA ? mockAPI.get('author/posts') : api.get('/posts/author.php'),
  
  uploadImage: (formData) =>
    USE_MOCK_DATA ? mockAPI.post('images/upload', formData) : api.post('/images/upload.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    
  // Search functionality
  searchPosts: (query, filters = {}) =>
    USE_MOCK_DATA ? mockAPI.get(`search?q=${query}`) : api.get(`/posts/search.php?q=${query}`, { params: filters }),
}; 