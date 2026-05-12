import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Lazy load pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const TakeQuiz = lazy(() => import('./pages/TakeQuiz'));

// Simple loading indicator
const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#002147] text-white">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
    />
  </div>
);

// Protected Route check (simplistic for demo)
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'ADMIN' | 'USER' }) => {
  const userJson = localStorage.getItem('polda_diy_current_user');
  if (!userJson) return <Navigate to="/" />;
  
  const user = JSON.parse(userJson);
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F0F2F5] font-sans text-gray-900 overflow-x-hidden">
        <Suspense fallback={<LoadingScreen />}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Login />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute role="USER">
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/quiz/:id" 
                element={
                  <ProtectedRoute role="USER">
                    <TakeQuiz />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute role="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </div>
    </Router>
  );
}
