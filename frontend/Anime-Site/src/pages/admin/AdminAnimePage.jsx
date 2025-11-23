import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminAnimePage = () => {
    const [animes, setAnimes] = useState([]);
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'create'
    
    // Form State
    const [formData, setFormData] = useState({
        title: '', description: '', imageUrl: '', rating: 0, 
        studio: '', status: 'Ongoing', type: 'TV', 
        releaseDate: '', totalEpisodes: 0
    });

    // Завантаження списку
    useEffect(() => {
        fetchAnimes();
    }, []);

    const fetchAnimes = async () => {
        try {
            const response = await api.get('/anime?page=1&pageSize=100'); // Беремо багато для адмінки
            const data = response.data.items || response.data || [];
            setAnimes(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/anime', formData);
            alert("Anime Created Successfully!");
            setActiveTab('list');
            fetchAnimes();
            // Очистка форми
            setFormData({ title: '', description: '', imageUrl: '', rating: 0, studio: '', status: 'Ongoing', type: 'TV', releaseDate: '', totalEpisodes: 0 });
        } catch (error) {
            alert("Error creating anime: " + error.response?.data || error.message);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-heading font-bold">Manage Anime</h1>
                <div className="flex bg-gray-800 rounded-lg p-1">
                    <button 
                        onClick={() => setActiveTab('list')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'list' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        List
                    </button>
                    <button 
                        onClick={() => setActiveTab('create')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'create' ? 'bg-anime-accent text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        + Create New
                    </button>
                </div>
            </div>

            {activeTab === 'create' ? (
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6">Create New Anime</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Title</label>
                            <input required type="text" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-2"
                                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>
                        
                        {/* Image URL */}
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                            <input required type="text" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-2"
                                value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea required rows="4" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-2"
                                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                        </div>

                        {/* Studio & Rating */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Studio</label>
                            <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-2"
                                value={formData.studio} onChange={e => setFormData({...formData, studio: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Rating (0-10)</label>
                            <input type="number" step="0.1" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-2"
                                value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} />
                        </div>

                        {/* Status & Type */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Status</label>
                            <select className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-2"
                                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                <option>Ongoing</option>
                                <option>Completed</option>
                                <option>Upcoming</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type</label>
                            <select className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-2"
                                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                <option>TV</option>
                                <option>Movie</option>
                                <option>OVA</option>
                            </select>
                        </div>

                        {/* Date & Total Episodes */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Release Date</label>
                            <input required type="date" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-2"
                                value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Total Episodes</label>
                            <input type="number" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-2"
                                value={formData.totalEpisodes} onChange={e => setFormData({...formData, totalEpisodes: parseInt(e.target.value)})} />
                        </div>

                        <div className="md:col-span-2 mt-4">
                            <button type="submit" className="w-full bg-anime-accent py-3 rounded font-bold hover:bg-red-600 transition">Create Anime</button>
                        </div>
                    </form>
                </div>
            ) : (
                // LIST VIEW
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-gray-400 border-b border-gray-700">
                                <th className="p-4">Image</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {animes.map(anime => (
                                <tr key={anime.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                                    <td className="p-4">
                                        <img src={anime.imageUrl} alt="" className="w-12 h-16 object-cover rounded" />
                                    </td>
                                    <td className="p-4 font-bold">{anime.title}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${anime.status === 'Ongoing' ? 'bg-green-900 text-green-400' : 'bg-gray-600'}`}>
                                            {anime.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link to={`/admin/episodes/${anime.id}`}>
                                            <button className="text-blue-400 hover:text-blue-300 border border-blue-400/30 px-3 py-1 rounded hover:bg-blue-900/20 transition mr-2">
                                                + Episodes
                                            </button>
                                        </Link>
                                        <button className="text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1 rounded hover:bg-red-900/20 transition">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminAnimePage;