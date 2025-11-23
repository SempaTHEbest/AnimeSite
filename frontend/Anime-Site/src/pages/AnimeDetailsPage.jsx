import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Перевір, чи папка називається context
import api from '../api/axios'; // Перевір, чи папка називається api
import Navbar from '../components/Navbar'; // Перевір, чи папка називається components

const AnimeDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Стани для кнопок
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [userRating, setUserRating] = useState(0); 
    const [hoverRating, setHoverRating] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);

    // 1. Завантажуємо дані про саме аніме
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

    // 2. "Хитрість": Перевіряємо, чи є це аніме у списку "Watch Later"
    useEffect(() => {
        const checkWatchlistStatus = async () => {
            if (!user) return; // Якщо не залогінені - не перевіряємо
            try {
                const response = await api.get('/interaction/watch-later');
                // Твій контролер повертає просто список (List), тому response.data це масив
                const list = response.data || [];
                
                // Шукаємо, чи є наше аніме (id) в цьому списку
                const exists = list.some(item => String(item.id) === String(id));
                setIsInWatchlist(exists);
            } catch (error) {
                console.error("Failed to check watchlist status", error);
            }
        };

        if (id && user) checkWatchlistStatus();
    }, [id, user]);

    // Логіка додавання/видалення зі списку
    const handleWatchlistToggle = async () => {
        if (!user) return navigate('/login');
        if (actionLoading) return;

        setActionLoading(true);
        try {
            if (isInWatchlist) {
                // Видаляємо
                await api.delete(`/interaction/watch-later/${id}`);
                setIsInWatchlist(false);
            } else {
                // Додаємо
                await api.post('/interaction/watch-later', { animeId: id });
                setIsInWatchlist(true);
            }
        } catch (error) {
            console.error("Watchlist action failed", error);
            alert("Error updating watchlist. Check console.");
        } finally {
            setActionLoading(false);
        }
    };

    // Логіка рейтингу
    const handleRate = async (ratingValue) => {
        if (!user) return navigate('/login');
        
        try {
            await api.post('/interaction/rate', { 
                animeId: id, 
                rating: ratingValue 
            });
            setUserRating(ratingValue);
            alert(`Rating saved: ${ratingValue}/10`);
        } catch (error) {
            console.error("Rating failed", error);
            alert("Failed to save rating.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-anime-dark flex items-center justify-center text-white">
            Loading...
        </div>
    );

    if (!anime) return null;

    return (
        <div className="min-h-screen bg-anime-dark text-white pb-20">
            <Navbar />

            {/* --- ФОНОВА КАРТИНКА (HERO) --- */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img 
                    src={anime.imageUrl || "https://placehold.co/1920x1080?text=No+Image"} 
                    alt={anime.title} 
                    className="w-full h-full object-cover blur-sm opacity-40 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-anime-dark via-anime-dark/60 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-8 pb-12">
                    <div className="container mx-auto flex flex-col md:flex-row items-end gap-8">
                        {/* Постер */}
                        <img 
                            src={anime.imageUrl} 
                            alt={anime.title} 
                            className="w-48 md:w-64 rounded-lg shadow-2xl border-2 border-gray-800 hidden md:block bg-gray-900 object-cover"
                        />
                        {/* Назва та інфо */}
                        <div className="flex-1 space-y-4 mb-2">
                            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
                                {anime.title}
                            </h1>
                            <div className="flex flex-wrap gap-3 text-sm font-bold">
                                <span className="bg-anime-accent px-3 py-1 rounded">
                                    ★ {anime.rating ? anime.rating.toFixed(1) : "N/A"}
                                </span>
                                <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded">
                                    {anime.type || "TV"}
                                </span>
                                <span className="bg-gray-800 border border-gray-700 px-3 py-1 rounded">
                                    {new Date(anime.releaseDate).getFullYear()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ОСНОВНИЙ КОНТЕНТ --- */}
            <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                
                {/* Ліва колонка: Опис */}
                <div className="md:col-span-2 space-y-10">
                    <section>
                        <h2 className="font-heading text-3xl mb-4 border-l-4 border-anime-accent pl-4">
                            Synopsis
                        </h2>
                        <p className="text-gray-300 leading-relaxed text-lg bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                            {anime.description || "No description available."}
                        </p>
                    </section>
                </div>

                {/* Права колонка: Кнопки */}
                <div className="space-y-6">
                    <button className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition">
                        ▶ Start Watching
                    </button>
                    
                    {/* КНОПКА WATCHLIST (Змінює колір і текст) */}
                    <button 
                        onClick={handleWatchlistToggle}
                        disabled={actionLoading}
                        className={`w-full border py-3 rounded-xl font-bold transition flex justify-center items-center gap-2 ${
                            isInWatchlist 
                                ? "bg-red-900/20 border-red-500 text-red-500 hover:bg-red-900/40" 
                                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                    >
                        {actionLoading ? "Processing..." : isInWatchlist ? "✓ Remove from List" : "+ Add to Watchlist"}
                    </button>

                    {/* БЛОК РЕЙТИНГУ */}
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 text-center">
                        <h3 className="font-heading text-xl mb-4">Rate this Anime</h3>
                        <div className="flex justify-center gap-1 mb-2">
                            {[...Array(10)].map((_, index) => {
                                const star = index + 1;
                                return (
                                    <button
                                        key={star}
                                        className={`text-2xl transition focus:outline-none ${
                                            star <= (hoverRating || userRating) 
                                                ? "text-yellow-400" 
                                                : "text-gray-600"
                                        }`}
                                        onClick={() => handleRate(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        ★
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-gray-500">
                            {userRating > 0 ? `Your rating: ${userRating}` : "Click to rate"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimeDetailsPage;