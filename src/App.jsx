import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './components/Home';
import LoginForm from './components/LoginForm';
import CreatePost from './components/CreatePost';
import RegisterForm from './components/RegisterForm'; // <-- Traemos el registro

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/register" element={<RegisterForm />} /> {/* <-- Activamos la ruta */}
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;