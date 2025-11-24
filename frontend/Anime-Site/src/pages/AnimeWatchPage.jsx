import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <--- ІМПОРТУЄМО AUTH
import api from '../api/axios';
import Navbar from '../components/Navbar';

const AnimeWatchPage = () => {
    const { id } = useParams();
    const { user } = useAuth(); // <--- ДІСТАЄМО ЮЗЕРА
    const [anime, setAnime] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [currentEpisode, setCurrentEpisode] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [seasons, setSeasons] = useState([]);

    // --- ЛОГІКА ДОДАВАННЯ В ІСТОРІЮ ---
    useEffect(() => {
        const addToHistory = async () => {
            // Перевіряємо: чи є юзер, чи є поточний епізод
            if (!user || !currentEpisode) return;

            try {
                // Відправляємо ID епізоду на сервер
                // Зверни увагу: бекенд чекає [FromBody] Guid, тому передаємо його в лапках як JSON рядок
                await api.post('/history', `"${currentEpisode.id}"`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log("Added to history:", currentEpisode.title);
            } catch (error) {
                console.error("Failed to update history:", error);
            }
        };

        addToHistory();
    }, [currentEpisode, user]); // Спрацьовує кожного разу, коли вмикається нова серія
    // ------------------------------------

    const getEmbedUrl = (url) => {
        if (!url) return "";
        if (url.includes("/embed/")) return url;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) return `https://www.youtube.com/embed/${match[2]}`;
        if (url.includes("drive.google.com") && url.includes("/view")) return url.replace("/view", "/preview");
        return url; 
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const animeRes = await api.get(`/anime/${id}`);
                setAnime(animeRes.data);

                const epRes = await api.get(`/episode/anime/${id}`);
                const allEpisodes = epRes.data || [];
                setEpisodes(allEpisodes);

                const uniqueSeasons = [...new Set(allEpisodes.map(ep => ep.seasonNumber))].sort((a, b) => a - b);
                setSeasons(uniqueSeasons);

                if (allEpisodes.length > 0) {
                    const sorted = allEpisodes.sort((a, b) => (a.seasonNumber - b.seasonNumber) || (a.episodeNumber - b.episodeNumber));
                    setCurrentEpisode(sorted[0]);
                    setSelectedSeason(sorted[0].seasonNumber);
                }
            } catch (error) {
                console.error("Failed to load anime data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const filteredEpisodes = episodes
        .filter(ep => ep.seasonNumber === selectedSeason)
        .sort((a, b) => a.episodeNumber - b.episodeNumber);

    if (loading) return <div className="min-h-screen bg-anime-dark flex items-center justify-center text-white">Loading Player...</div>;
    if (!anime) return <div className="min-h-screen bg-anime-dark flex items-center justify-center text-white">Anime not found</div>;

    return (
        <div className="min-h-screen bg-anime-dark text-white flex flex-col">
            <Navbar />
            
            <div className="container mx-auto px-4 py-24 flex-grow">
                <div className="flex items-center gap-4 mb-6">
                    <Link to={`/anime/${id}`} className="text-gray-400 hover:text-white transition">
                        ← Back to Details
                    </Link>
                    <h1 className="text-2xl font-heading font-bold text-white truncate">
                        Watching: <span className="text-anime-accent">{anime.title}</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative w-full pt-[56.25%] bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                            {currentEpisode ? (
                                <iframe 
                                    src={getEmbedUrl(currentEpisode.episodeLink)} 
                                    title={currentEpisode.title}
                                    className="absolute top-0 left-0 w-full h-full"
                                    frameBorder="0" 
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-500">
                                    No video available
                                </div>
                            )}
                        </div>
                        
                        {currentEpisode && (
                            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                                <h2 className="text-xl font-bold mb-2">
                                    S{currentEpisode.seasonNumber} E{currentEpisode.episodeNumber}: {currentEpisode.title}
                                </h2>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {currentEpisode.summary || "No description for this episode."}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col max-h-[600px]">
                        <div className="p-4 border-b border-gray-800 overflow-x-auto flex gap-2 scrollbar-hide">
                            {seasons.map(season => (
                                <button
                                    key={season}
                                    onClick={() => setSelectedSeason(season)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition ${
                                        selectedSeason === season 
                                            ? 'bg-anime-accent text-white shadow-lg' 
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                                >
                                    Season {season}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                            {filteredEpisodes.length > 0 ? (
                                filteredEpisodes.map(ep => (
                                    <div 
                                        key={ep.id}
                                        onClick={() => setCurrentEpisode(ep)}
                                        className={`p-3 rounded-lg cursor-pointer transition flex items-center gap-3 group ${
                                            currentEpisode?.id === ep.id 
                                                ? 'bg-gray-800 border-l-4 border-anime-accent' 
                                                : 'hover:bg-gray-800 border-l-4 border-transparent'
                                        }`}
                                    >
                                        <div className="w-8 h-8 flex-shrink-0 bg-black/50 rounded flex items-center justify-center text-xs font-bold text-gray-400 group-hover:text-white">
                                            {ep.episodeNumber}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-sm font-bold truncate ${currentEpisode?.id === ep.id ? 'text-anime-accent' : 'text-gray-300 group-hover:text-white'}`}>
                                                {ep.title || `Episode ${ep.episodeNumber}`}
                                            </h4>
                                            <span className="text-[10px] text-gray-500">
                                                {new Date(ep.releaseDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {currentEpisode?.id === ep.id && (
                                            <div className="w-2 h-2 bg-anime-accent rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    No episodes found for Season {selectedSeason}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimeWatchPage;