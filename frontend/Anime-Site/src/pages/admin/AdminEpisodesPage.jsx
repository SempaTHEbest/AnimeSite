import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AdminEpisodesPage = () => {
    const { animeId } = useParams();
    const navigate = useNavigate();
    
    const [anime, setAnime] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    
    const [formData, setFormData] = useState({
        title: '', 
        summary: '', 
        seasonNumber: 1, 
        episodeNumber: 1, 
        releaseDate: new Date().toISOString().split('T')[0], 
        episodeLink: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const animeRes = await api.get(`/anime/${animeId}`);
                setAnime(animeRes.data);

                const epRes = await api.get(`/episode/anime/${animeId}`);
                setEpisodes(epRes.data);
                
                if (epRes.data.length > 0) {
                    // Знаходимо останній епізод, щоб підставити наступний номер
                    const sorted = epRes.data.sort((a,b) => a.episodeNumber - b.episodeNumber);
                    const lastEp = sorted[sorted.length - 1];
                    
                    setFormData(prev => ({ 
                        ...prev, 
                        seasonNumber: lastEp.seasonNumber, // Залишаємо той самий сезон
                        episodeNumber: lastEp.episodeNumber + 1 // Збільшуємо номер серії
                    }));
                }
            } catch (error) {
                console.error("Error loading data", error);
            }
        };
        fetchData();
    }, [animeId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/episode', {
                ...formData,
                animeId: animeId
            });
            alert("Episode Added!");
            
            const epRes = await api.get(`/episode/anime/${animeId}`);
            setEpisodes(epRes.data);
            
            setFormData(prev => ({
                ...prev,
                title: '', summary: '',
                episodeNumber: prev.episodeNumber + 1,
                episodeLink: ''
            }));
        } catch (error) {
            // Безпечна обробка помилки
            const msg = error.response?.data || error.message;
            alert("Failed to add episode: " + msg);
        }
    };

    if (!anime) return <div className="text-white p-8 text-center">Loading...</div>;

    return (
        <div className="animate-fade-in text-white">
            <button onClick={() => navigate('/admin/anime')} className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition">
                <span>←</span> Back to Anime List
            </button>
            
            <div className="flex items-center gap-6 mb-8 border-b border-gray-700 pb-6">
                <img src={anime.imageUrl} alt="" className="w-24 h-36 object-cover rounded-lg shadow-lg bg-gray-800" />
                <div>
                    <h1 className="text-3xl font-heading font-bold">{anime.title}</h1>
                    <p className="text-anime-accent font-bold">Manage Episodes</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {animeId}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- ФОРМА --- */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit shadow-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-anime-accent">+</span> Add New Episode
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* ВИПРАВЛЕНА ЧАСТИНА: Чіткі підписи для Сезону та Епізоду */}
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">
                                    Season
                                </label>
                                <input 
                                    type="number" 
                                    className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 focus:border-anime-accent outline-none transition"
                                    value={formData.seasonNumber} 
                                    onChange={e => setFormData({...formData, seasonNumber: parseInt(e.target.value)})} 
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs text-gray-400 mb-1 font-bold uppercase tracking-wider">
                                    Episode No.
                                </label>
                                <input 
                                    type="number" 
                                    className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 focus:border-anime-accent outline-none transition"
                                    value={formData.episodeNumber} 
                                    onChange={e => setFormData({...formData, episodeNumber: parseInt(e.target.value)})} 
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Title</label>
                            <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 focus:border-anime-accent outline-none transition"
                                placeholder="Episode Title"
                                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Video Link / Embed</label>
                            <input type="text" required className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 focus:border-anime-accent outline-none transition"
                                placeholder="https://..." value={formData.episodeLink} onChange={e => setFormData({...formData, episodeLink: e.target.value})} />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Summary</label>
                            <textarea rows="3" className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 focus:border-anime-accent outline-none transition"
                                value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})}></textarea>
                        </div>
                         <div>
                            <label className="block text-xs text-gray-400 mb-1">Release Date</label>
                            <input type="date" className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 focus:border-anime-accent outline-none transition"
                                value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} />
                        </div>

                        <button type="submit" className="w-full bg-anime-accent py-2 rounded font-bold hover:bg-red-600 transition shadow-lg">
                            Add Episode
                        </button>
                    </form>
                </div>

                {/* --- СПИСОК --- */}
                <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col max-h-[700px]">
                    <div className="p-4 bg-gray-900 border-b border-gray-700 font-bold flex justify-between items-center">
                        <span>Existing Episodes</span>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">{episodes.length} Total</span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-4 space-y-2 custom-scrollbar">
                        {episodes.length > 0 ? (
                            // Сортуємо: Спочатку Сезони, потім Епізоди
                            episodes.sort((a,b) => (a.seasonNumber - b.seasonNumber) || (a.episodeNumber - b.episodeNumber)).map(ep => (
                                <div key={ep.id} className="flex items-center justify-between bg-gray-700/30 p-3 rounded border border-gray-700 hover:bg-gray-700 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center font-bold text-anime-accent text-sm border border-gray-600">
                                            {ep.episodeNumber}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">{ep.title}</h4>
                                            <p className="text-xs text-gray-400">
                                                Season {ep.seasonNumber} • {new Date(ep.releaseDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a href={ep.episodeLink} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline bg-blue-900/20 px-2 py-1 rounded border border-blue-900/50">
                                            Link ↗
                                        </a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-10">No episodes added yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEpisodesPage;