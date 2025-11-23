import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
    const location = useLocation();
    
    const menuItems = [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/genres', label: 'Manage Genres' },
        { path: '/admin/anime', label: 'Manage Anime' },
        // Можна додати Users, якщо буде адмінка юзерів
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div className="p-6 border-b border-gray-700">
                    <h2 className="font-heading text-2xl text-anime-accent font-bold">ADMIN PANEL</h2>
                    <Link to="/" className="text-xs text-gray-400 hover:text-white">← Back to Main Site</Link>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className={`block px-4 py-3 rounded-lg transition font-medium ${
                                location.pathname === item.path 
                                ? 'bg-anime-accent text-white shadow-lg shadow-red-900/50' 
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-700 text-xs text-gray-500 text-center">
                    Admin Access Only
                </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                <div className="max-w-5xl mx-auto">
                    <Outlet /> {/* Тут будуть рендеритись сторінки адмінки */}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;