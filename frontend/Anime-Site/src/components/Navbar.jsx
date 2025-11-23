import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Отримуємо реального юзера з контексту
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Для випадаючого меню профілю
  const dropdownRef = useRef(null);

  // Закривати меню, якщо клікнули поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300 bg-gradient-to-b from-black/90 to-transparent">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* --- LOGO --- */}
        <Link to="/" className="flex items-center gap-2 group">
           <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full animate-pulse group-hover:scale-110 transition shadow-[0_0_15px_rgba(124,58,237,0.5)]"></div>
           <span className="font-heading text-2xl tracking-wider font-bold text-white group-hover:text-gray-200 transition drop-shadow-lg">
             TOKYO CALLING
           </span>
        </Link>
        
        {/* --- DESKTOP MENU --- */}
        <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8 font-medium text-sm tracking-wide text-gray-300">
                <li className="hover:text-anime-accent cursor-pointer transition hover:scale-105">
                    <Link to="/">home</Link>
                </li>
                <li className="hover:text-anime-accent cursor-pointer transition hover:scale-105">
                    <Link to="/streams">streams</Link>
                </li>
                <li className="hover:text-anime-accent cursor-pointer transition hover:scale-105">
                    <Link to="/news">news</Link>
                </li>
            </ul>

            {/* --- AUTH SECTION (RIGHT SIDE) --- */}
            <div className="flex items-center gap-4 pl-6 border-l border-gray-700 ml-2">
                {user ? (
                    // === ВАРІАНТ ДЛЯ ЗАЛОГІНЕНОГО (USER MENU) ===
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 hover:opacity-80 transition focus:outline-none"
                        >
                            <span className="text-white text-sm font-bold hidden lg:block">
                                {user.username}
                            </span>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-anime-accent overflow-hidden shadow-lg shadow-red-900/20">
                                    {/* Placeholder аватарка або перша літера */}
                                    <img 
                                        src="https://ui-avatars.com/api/?name=User&background=1f2937&color=fff" 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                {/* Зелений індикатор "Online" */}
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
                            </div>
                            {/* Стрілочка вниз */}
                            <span className={`text-gray-400 text-xs transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>

                        {/* DROPDOWN MENU */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl shadow-black overflow-hidden animate-fade-in z-50">
                                <div className="px-4 py-3 border-b border-gray-800">
                                    <p className="text-sm text-white font-bold truncate">{user.username}</p>
                                    <p className="text-xs text-gray-500 truncate">Member</p>
                                </div>
                                <ul className="py-1">
                                    <li>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">
                                            My Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/watchlist" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition">
                                            Watchlist <span className="ml-2 bg-anime-accent text-[10px] px-1.5 rounded text-white">New</span>
                                        </Link>
                                    </li>
                                    <li className="border-t border-gray-800 mt-1">
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition"
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    // === ВАРІАНТ ДЛЯ ГОСТЯ (LOGIN / SIGN UP) ===
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <button className="text-gray-300 text-sm font-bold hover:text-white hover:underline transition decoration-anime-accent underline-offset-4">
                                Log In
                            </button>
                        </Link>
                        
                        <Link to="/register">
                            <button className="bg-anime-accent text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_4px_14px_0_rgba(255,77,77,0.39)] hover:bg-red-600 hover:scale-105 hover:shadow-[0_6px_20px_rgba(255,77,77,0.23)] transition transform duration-200">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
        
        {/* --- MOBILE MENU TOGGLE --- */}
        <button 
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
            {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-anime-dark/95 backdrop-blur-xl border-t border-gray-800 p-6 flex flex-col gap-4 text-center shadow-2xl">
              <Link to="/" className="text-white hover:text-anime-accent text-lg" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/streams" className="text-white hover:text-anime-accent text-lg" onClick={() => setIsMobileMenuOpen(false)}>Streams</Link>
              <div className="h-[1px] bg-gray-700 my-2 w-1/2 mx-auto"></div>
              
              {!user ? (
                  <div className="flex flex-col gap-3 mt-2">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="w-full py-3 text-white font-bold border border-gray-600 rounded-xl hover:bg-white hover:text-black transition">Log In</button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="w-full py-3 bg-anime-accent text-white font-bold rounded-xl hover:bg-red-600 transition shadow-lg">Sign Up</button>
                    </Link>
                  </div>
              ) : (
                  <div className="flex flex-col gap-3 mt-2">
                      <div className="flex items-center justify-center gap-3 mb-2">
                          <img src="https://ui-avatars.com/api/?name=User&background=1f2937&color=fff" className="w-8 h-8 rounded-full border border-anime-accent"/>
                          <span className="font-bold text-anime-accent">{user.username}</span>
                      </div>
                      <button onClick={handleLogout} className="text-red-400 border border-red-900/50 py-2 rounded-lg hover:bg-red-900/20">Sign Out</button>
                  </div>
              )}
          </div>
      )}
    </nav>
  );
};

export default Navbar;