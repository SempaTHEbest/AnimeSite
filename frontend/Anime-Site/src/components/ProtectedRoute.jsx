import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Checking permissions...</div>;
    }

    // 1. Якщо користувач не авторизований -> відправляємо на Логін
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Якщо роль користувача не входить у список дозволених -> відправляємо на Головну
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Можна закоментувати alert, якщо він дратує
        alert("Access Denied: You do not have permission to view this page."); 
        return <Navigate to="/" replace />;
    }

    // 3. Якщо все ок -> показуємо сторінку
    return <Outlet />;
};

export default ProtectedRoute;