import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { App as AntApp } from 'antd';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Search from './pages/Search';
import AIChat from './pages/AIChat';
import CVSummariser from './pages/CVSummariser';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import Register from './pages/Register';
import JDGenerator from './pages/JDGenerator';
import NotFound from './pages/NotFound';
import { Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <AntApp>
        <Router>
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes Wrapper */}
            <Route element={<ProtectedRoute />}>
              {/* Main Layout Wrapper */}
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/search" element={<Search />} />
                <Route path="/chat" element={<AIChat />} />
                <Route path="/summarizer" element={<CVSummariser />} />
                <Route path="/jd-generator" element={<JDGenerator />} />
                <Route path="/jobs" element={<Jobs />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AntApp>
    </AuthProvider>
  );
}

export default App;
