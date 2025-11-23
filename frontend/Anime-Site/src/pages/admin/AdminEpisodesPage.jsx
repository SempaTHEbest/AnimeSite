import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AdminEpisodesPage = () => {
    const { animeId } = useParams();
    const navigate = useNavigate();
    
    const [anime, setAnime] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    
    // Form state
    const [formData, setFormData] = useState({
        title: '', summary: '', seasonNumber: 1, episodeNumber: 1, 
        releaseDate: new Date().toISOString().split('T')[0], episodeLink: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Отримуємо інфу про аніме (щоб показати назву)
                const animeRes = await api.get(`/anime/${animeId}`);
                setAnime(animeRes.data);

                // Отримуємо список епізодів
                const epRes = await api.get(`/episode/anime/${animeId}`);
                setEpisodes(epRes.data);
                
                // Автоматично ставимо наступний номер епізоду
                if (epRes.data.length > 0) {
                    const lastEp = epRes.data[epRes.data.length - 1];
                    setFormData(prev => ({ ...prev, episodeNumber: lastEp.episodeNumber + 1 }));
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
            
            // Оновлюємо список
            const epRes = await api.get(`/episode/anime/${animeId}`);
            setEpisodes(epRes.data);
            
            // Готуємо форму до наступного епізоду
            setFormData(prev => ({
                ...prev,
                title: '', summary: '',
                episodeNumber: prev.episodeNumber + 1,
                episodeLink: ''
            }));
        } catch (error) {
            alert("Failed to add episode: " + error.response?.data || error.message);
        }
    };

    if (!anime) return <div className="text-white p-8">Loading...</div>;

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate('/admin/anime')} className="text-gray-400 hover:text-white mb-4">
                ← Back to Anime List
            </button>
            
            <div className="flex items-center gap-6 mb-8 border-b border-gray-700 pb-6">
                <img src={anime.imageUrl} alt="" className="w-24 h-36 object-cover rounded-lg shadow-lg" />
                <div>
                    <h1 className="text-3xl font-bold">{anime.title}</h1>
                    <p className="text-gray-400">Manage Episodes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CREATE FORM */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-fit">
                    <h3 className="text-xl font-bold mb-4">Add New Episode</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Episode Number</label>
                            <div className="flex gap-2">
                                <input type="number" className="w-1/3 bg-gray-900 border border-gray-600 rounded px-3 py-2"
                                    placeholder="Ep #" value={formData.episodeNumber} onChange={e => setFormData({...formData, episodeNumber: parseInt(e.target.value)})} />
                                <input type="number" className="w-1/3 bg-gray-900 border border-gray-600 rounded px-3 py-2"
                                    placeholder="Season" value={formData.seasonNumber} onChange={e => setFormData({...formData, seasonNumber: parseInt(e.target.value)})} />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Title</label>
                            <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2"
                                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Video/Stream Link</label>
                            <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2"
                                placeholder="https://..." value={formData.episodeLink} onChange={e => setFormData({...formData, episodeLink: e.target.value})} />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Summary</label>
                            <textarea rows="3" className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2"
                                value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})}></textarea>
                        </div>
                         <div>
                            <label className="block text-xs text-gray-400 mb-1">Release Date</label>
                            <input type="date" className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2"
                                value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} />
                        </div>

                        <button type="submit" className="w-full bg-anime-accent py-2 rounded font-bold hover:bg-red-600 transition">
                            Add Episode
                        </button>
                    </form>
                </div>

                {/* EPISODE LIST */}
                <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="p-4 bg-gray-900 border-b border-gray-700 font-bold">
                        Existing Episodes ({episodes.length})
                    </div>
                    <div className="max-h-[600px] overflow-y-auto p-4 space-y-2">
                        {episodes.length > 0 ? (
                            episodes.sort((a,b) => a.episodeNumber - b.episodeNumber).map(ep => (
                                <div key={ep.id} className="flex items-center justify-between bg-gray-700/30 p-3 rounded border border-gray-700">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center font-bold text-anime-accent">
                                            {ep.episodeNumber}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">{ep.title}</h4>
                                            <p className="text-xs text-gray-400">Season {ep.seasonNumber} • {new Date(ep.releaseDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500 truncate max-w-[150px]">
                                        {ep.episodeLink}
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