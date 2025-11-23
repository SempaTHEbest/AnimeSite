import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [watchList, setWatchList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('watchlist'); // 'watchlist', 'history', 'rated'

    // Завантажуємо реальний WatchList з бекенду
    useEffect(() => {
        const fetchWatchList = async () => {
            if (!user) return;
            try {
                const response = await api.get('/interaction/watch-later');
                // Перевіряємо, чи прийшов масив, чи об'єкт PagedResponse
                const data = response.data.items || response.data || [];
                setWatchList(data);
            } catch (error) {
                console.error("Failed to load watchlist", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchList();
    }, [user]);

    // Якщо користувач не авторизований - редірект
    useEffect(() => {
        if (!user && !loading) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-anime-dark text-white">
            <Navbar />
            
            <div className="container mx-auto px-6 py-24 animate-fade-in">
                {/* --- HEADER PROFILE SECTION --- */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-anime-accent overflow-hidden shadow-[0_0_30px_rgba(255,77,77,0.4)]">
                             <img 
                                src={`https://ui-avatars.com/api/?name=${user.username}&background=0a0b1e&color=fff&size=256`} 
                                alt="Profile" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        {/* Кнопка редагування (декоративна) */}
                        <button className="absolute bottom-2 right-2 bg-gray-800 p-2 rounded-full border border-gray-600 hover:bg-white hover:text-black transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold">{user.username}</h1>
                            <p className="text-gray-400 mt-1">Member since 2024</p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-xl text-center min-w-[100px]">
                                <span className="block text-2xl font-bold text-white">{watchList.length}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Saved</span>
                            </div>
                            <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-xl text-center min-w-[100px]">
                                <span className="block text-2xl font-bold text-white">0</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Watched</span>
                            </div>
                            <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-xl text-center min-w-[100px]">
                                <span className="block text-2xl font-bold text-white">0</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Reviews</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-white hover:text-black transition font-bold">
                            Edit Profile
                        </button>
                        <button onClick={logout} className="px-6 py-2 border border-red-900/50 text-red-400 rounded-lg hover:bg-red-900/20 transition">
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* --- TABS --- */}
                <div className="border-b border-gray-800 mb-8 flex gap-8 overflow-x-auto">
                    {['watchlist', 'history', 'rated'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-lg font-bold tracking-wide capitalize transition-all relative whitespace-nowrap ${
                                activeTab === tab ? 'text-anime-accent' : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            {tab === 'watchlist' ? 'My List' : tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-anime-accent rounded-t-full shadow-[0_-2px_10px_rgba(255,77,77,0.5)]"></span>
                            )}
                        </button>
                    ))}
                </div>

                {/* --- CONTENT GRID --- */}
                <div className="min-h-[300px]">
                    {loading ? (
                         <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-anime-accent"></div></div>
                    ) : (
                        <>
                            {activeTab === 'watchlist' && (
                                <>
                                    {watchList.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                            {watchList.map((item) => (
                                                <Link to={`/anime/${item.id}`} key={item.id} className="group relative rounded-xl overflow-hidden aspect-[2/3] cursor-pointer bg-gray-800">
                                                    <img 
                                                        src={item.imageUrl || "https://placehold.co/300x450"} 
                                                        alt={item.title} 
                                                        className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-90 transition"></div>
                                                    
                                                    <div className="absolute bottom-0 left-0 p-4 w-full">
                                                        <h4 className="font-bold text-white truncate text-sm">{item.title}</h4>
                                                        <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                                                            <span className="text-green-400 font-bold">★ {item.rating}</span>
                                                            <span className="border border-gray-600 px-1 rounded text-[10px]">{item.type || 'TV'}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-gray-800 border-dashed">
                                            <p className="text-gray-500 text-xl mb-4">Your watchlist is empty.</p>
                                            <Link to="/">
                                                <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-anime-accent hover:text-white transition">
                                                    Browse Anime
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'history' && (
                                <div className="text-center py-20 text-gray-500">
                                    <p>Watch history will appear here...</p>
                                </div>
                            )}
                            
                            {activeTab === 'rated' && (
                                <div className="text-center py-20 text-gray-500">
                                    <p>Rated titles will appear here...</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;