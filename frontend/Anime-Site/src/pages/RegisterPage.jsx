import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(username, email, password);
            // Після успішної реєстрації перекидаємо на логін
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-anime-dark text-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1920" alt="bg" className="w-full h-full object-cover opacity-20 blur-sm" />
                </div>

                <div className="relative z-10 bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl">
                    <h2 className="text-3xl font-heading text-center mb-6 tracking-wider">Create Account</h2>
                    
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Username</label>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-anime-accent transition"
                                placeholder="OtakuKing"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-anime-accent transition"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Password</label>
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-anime-accent transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        
                        <button type="submit" className="w-full bg-anime-accent hover:bg-red-600 text-white font-bold py-3 rounded transition shadow-lg shadow-red-900/50 mt-2">
                            Sign Up
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Already have an account? <Link to="/login" className="text-anime-accent hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;