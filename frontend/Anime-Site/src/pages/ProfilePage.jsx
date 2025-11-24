import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import EditProfileModal from '../components/EditProfileModal'; // <-- ІМПОРТ

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const [watchList, setWatchList] = useState([]);
    const [historyList, setHistoryList] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('watchlist');
    
    // Стан для модального вікна
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const [watchlistRes, historyRes] = await Promise.allSettled([
                    api.get('/interaction/watch-later'),
                    api.get('/history/resume')
                ]);

                if (watchlistRes.status === 'fulfilled') {
                    const data = watchlistRes.value.data.items || watchlistRes.value.data || [];
                    setWatchList(data);
                }
                
                if (historyRes.status === 'fulfilled') {
                    setHistoryList(historyRes.value.data || []);
                }

            } catch (error) {
                console.error("Error loading profile data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    useEffect(() => {
        if (!user && !loading) navigate('/login');
    }, [user, loading, navigate]);

    if (!user) return null;

    // Логіка вибору аватарки: Якщо є URL в профілі - беремо його, інакше - заглушка
    const avatarSrc = user.avatarUrl 
        ? user.avatarUrl 
        : `https://ui-avatars.com/api/?name=${user.username}&background=0a0b1e&color=fff&size=256`;

    return (
        <div className="min-h-screen bg-anime-dark text-white">
            <Navbar />
            
            {/* Модальне вікно редагування */}
            <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />

            <div className="container mx-auto px-6 py-24 animate-fade-in">
                {/* --- HEADER PROFILE SECTION --- */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-anime-accent overflow-hidden shadow-[0_0_30px_rgba(255,77,77,0.4)] bg-black">
                             <img 
                                src={avatarSrc} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${user.username}&background=0a0b1e&color=fff`} 
                            />
                        </div>
                        <button 
                            onClick={() => setIsEditOpen(true)}
                            className="absolute bottom-2 right-2 bg-gray-800 p-2 rounded-full border border-gray-600 hover:bg-white hover:text-black transition"
                        >
                            ✎
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold">{user.username}</h1>
                            {/* Показуємо BIO якщо є, інакше дефолтний текст */}
                            <p className="text-gray-400 mt-2 max-w-xl mx-auto md:mx-0 text-sm leading-relaxed">
                                {user.bio || "No bio yet. Click 'Edit Profile' to add one!"}
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                            <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-xl text-center min-w-[100px]">
                                <span className="block text-2xl font-bold text-white">{watchList.length}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Saved</span>
                            </div>
                            <div className="bg-gray-900 border border-gray-800 px-6 py-3 rounded-xl text-center min-w-[100px]">
                                <span className="block text-2xl font-bold text-white">{historyList.length}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Watched</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => setIsEditOpen(true)}
                            className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-white hover:text-black transition font-bold"
                        >
                            Edit Profile
                        </button>
                        <button onClick={logout} className="px-6 py-2 border border-red-900/50 text-red-400 rounded-lg hover:bg-red-900/20 transition">
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* ... ТАБИ ТА КОНТЕНТ (ЗАЛИШАЄТЬСЯ БЕЗ ЗМІН ЯК У ПОПЕРЕДНЬОМУ КОДІ) ... */}
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
                            {/* Watchlist Tab */}
                            {activeTab === 'watchlist' && (
                                <>
                                    {watchList.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                            {watchList.map((item) => (
                                                <Link to={`/anime/${item.id}`} key={item.id} className="group relative rounded-xl overflow-hidden aspect-[2/3] cursor-pointer bg-gray-800 border border-gray-800 hover:border-anime-accent transition">
                                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                                    <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black to-transparent">
                                                        <h4 className="font-bold text-white truncate text-sm">{item.title}</h4>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 text-gray-500">Your watchlist is empty.</div>
                                    )}
                                </>
                            )}

                            {/* History Tab */}
                            {activeTab === 'history' && (
                                <>
                                    {historyList.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                            {historyList.map((item) => (
                                                <Link to={`/anime/${item.animeId}`} key={item.animeId} className="group relative rounded-xl overflow-hidden aspect-[2/3] cursor-pointer bg-gray-800 border border-gray-800 hover:border-anime-accent transition">
                                                    <img src={item.animeImageUrl} alt={item.animeTitle} className="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                                                    <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm p-3 border-t border-gray-700">
                                                        <h4 className="font-bold text-white truncate text-sm mb-1">{item.animeTitle}</h4>
                                                        <div className="text-xs text-anime-accent">Ep {item.lastEpisodeNumber}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 text-gray-500">You haven't watched anything yet.</div>
                                    )}
                                </>
                            )}
                            
                            {/* Rated Tab */}
                            {activeTab === 'rated' && (
                                <div className="text-center py-20 text-gray-500">Rated titles will appear here...</div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;