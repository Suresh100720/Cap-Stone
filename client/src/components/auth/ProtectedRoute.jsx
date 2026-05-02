import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]"><LoadingSpinner /></div>;
  
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
