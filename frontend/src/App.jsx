import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Categories from './pages/Categories';

// Layout component with animations
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-container">
        <AnimatedRoutes />
      </main>
    </Router>
  )
}

export default App
