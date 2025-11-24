import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const AnimeDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // <-- Хук для навігації
    const { user } = useAuth();
    
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Стан для інтерактиву
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [userRating, setUserRating] = useState(0); 
    const [hoverRating, setHoverRating] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);

    // 1. Завантаження даних аніме
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/anime/${id}`);
                setAnime(response.data);
            } catch (err) {
                console.error("Error fetching details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    // 2. Перевірка, чи аніме в Watchlist
    useEffect(() => {
        const checkWatchlistStatus = async () => {
            if (!user) return;
            try {
                const response = await api.get('/interaction/watch-later');
                const list = response.data.items || response.data || [];
                const exists = list.some(item => String(item.id) === String(id));
                setIsInWatchlist(exists);
            } catch (error) {
                console.error("Failed to check watchlist status", error);
            }
        };

        if (id && user) checkWatchlistStatus();
    }, [id, user]);

    // --- ЛОГІКА КНОПОК ---

    const handleWatchlistToggle = async () => {
        if (!user) return navigate('/login');
        if (actionLoading) return;

        setActionLoading(true);
        try {
            if (isInWatchlist) {
                await api.delete(`/interaction/watch-later/${id}`);
                setIsInWatchlist(false);
            } else {
                await api.post('/interaction/watch-later', { animeId: id });
                setIsInWatchlist(true);
            }
        } catch (error) {
            console.error("Watchlist action failed", error);
            alert("Something went wrong with watchlist action!");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRate = async (ratingValue) => {
        if (!user) return navigate('/login');
        try {
            await api.post('/interaction/rate', { 
                animeId: id, 
                rating: ratingValue 
            });
            setUserRating(ratingValue);
            alert(`You rated this anime ${ratingValue}/10!`);
        } catch (error) {
            console.error("Rating failed", error);
            alert("Failed to submit rating.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-anime-dark flex items-center justify-center text-anime-accent text-xl font-bold animate-pulse">
            Loading...
        </div>
    );

    if (!anime) return null;

    return (
        <div className="min-h-screen bg-anime-dark text-white animate-fade-in pb-20">
            <Navbar />

            {/* --- HERO BACKGROUND --- */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img 
                    src={anime.imageUrl || "https://placehold.co/1920x1080?text=No+Image"} 
                    alt={anime.title} 
                    className="w-full h-full object-cover blur-sm opacity-40 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-anime-dark via-anime-dark/60 to-transparent"></div>
                
                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 pb-12">
                    <div className="container mx-auto flex flex-col md:flex-row items-end gap-8">
                        
                        {/* Poster (Floating) */}
                        <img 
                            src={anime.imageUrl} 
                            alt={anime.title} 
                            className="w-48 md:w-64 rounded-lg shadow-2xl shadow-black border-2 border-gray-800 hidden md:block bg-gray-900 object-cover"
                        />

                        {/* Title & Meta */}
                        <div className="flex-1 space-y-4 mb-2">
                            <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight text-white drop-shadow-lg">
                                {anime.title}
                            </h1>
                            
                            <div className="flex flex-wrap gap-3 text-sm font-bold tracking-wide">
                                <span className="bg-anime-accent text-white px-3 py-1 rounded shadow-lg shadow-red-900/50">
                                    ★ {anime.rating ? anime.rating.toFixed(1) : "N/A"}
                                </span>
                                <span className="bg-gray-800 text-gray-300 border border-gray-700 px-3 py-1 rounded uppercase">
                                    {anime.type || "TV"}
                                </span>
                                <span className="bg-gray-800 text-gray-300 border border-gray-700 px-3 py-1 rounded">
                                    {new Date(anime.releaseDate).getFullYear()}
                                </span>
                                <span className={`px-3 py-1 rounded font-bold text-black ${anime.status === 'Ongoing' ? 'bg-green-400' : 'bg-white'}`}>
                                    {anime.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN INFO GRID --- */}
            <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                
                {/* Left Column: Synopsis */}
                <div className="md:col-span-2 space-y-10">
                    <section>
                        <h2 className="font-heading text-3xl text-white mb-4 flex items-center gap-2">
                            <span className="w-2 h-8 bg-anime-accent rounded-full"></span>
                            Synopsis
                        </h2>
                        <p className="text-gray-300 leading-relaxed text-lg bg-gray-900/50 p-6 rounded-xl border border-gray-800 shadow-inner">
                            {anime.description || "No description available."}
                        </p>
                    </section>
                </div>

                {/* Right Column: ACTIONS SIDEBAR */}
                <div className="space-y-6">
                    {/* --- ОНОВЛЕНА КНОПКА START WATCHING --- */}
                    <button 
                        onClick={() => navigate(`/anime/${id}/watch`)}
                        className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-200 hover:scale-[1.02] transition transform duration-200 flex justify-center items-center gap-2"
                    >
                        <span>▶</span> Start Watching
                    </button>
                    
                    {/* WATCHLIST BUTTON */}
                    <button 
                        onClick={handleWatchlistToggle}
                        disabled={actionLoading}
                        className={`w-full border py-3 rounded-xl font-bold transition flex justify-center items-center gap-2 ${
                            isInWatchlist 
                                ? "bg-gray-800 border-red-500 text-red-500 hover:bg-red-900/20" 
                                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                    >
                        {actionLoading ? (
                            <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></span>
                        ) : isInWatchlist ? (
                            <>✓ Remove from List</>
                        ) : (
                            <>+ Add to Watchlist</>
                        )}
                    </button>

                    {/* RATING BOX */}
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4">
                        <h3 className="font-heading text-xl border-b border-gray-800 pb-2">Rate this Anime</h3>
                        
                        <div className="flex flex-wrap justify-center gap-1">
                            {[...Array(10)].map((_, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`text-2xl transition-transform duration-100 hover:scale-125 focus:outline-none ${
                                            ratingValue <= (hoverRating || userRating) 
                                                ? "text-yellow-400" 
                                                : "text-gray-600"
                                        }`}
                                        onClick={() => handleRate(ratingValue)}
                                        onMouseEnter={() => setHoverRating(ratingValue)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        ★
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-center text-xs text-gray-500">
                            {userRating > 0 ? `You rated: ${userRating}/10` : "Click a star to rate"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimeDetailsPage;