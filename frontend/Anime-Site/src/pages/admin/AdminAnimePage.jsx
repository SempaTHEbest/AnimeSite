import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminAnimePage = () => {
    const [animes, setAnimes] = useState([]);
    const [activeTab, setActiveTab] = useState('list'); // 'list' або 'create'
    const [isLoading, setIsLoading] = useState(false);
    
    // Стан для форми створення аніме
    const [formData, setFormData] = useState({
        title: '', description: '', imageUrl: '', rating: 0, 
        studio: '', status: 'Ongoing', type: 'TV', 
        releaseDate: '', totalEpisodes: 0
    });

    // Завантажуємо список при відкритті сторінки
    useEffect(() => {
        fetchAnimes();
    }, []);

    const fetchAnimes = async () => {
        setIsLoading(true);
        try {
            // Запит на отримання всіх аніме (сторінка 1, розмір 100)
            const response = await api.get('/anime?page=1&pageSize=100');
            const data = response.data.items || response.data || [];
            setAnimes(data);
        } catch (error) {
            console.error("Error fetching anime:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Створення нового аніме
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/anime', formData);
            alert("Anime Created Successfully!");
            setActiveTab('list');
            fetchAnimes(); // Оновлюємо список
            // Очищаємо форму
            setFormData({ title: '', description: '', imageUrl: '', rating: 0, studio: '', status: 'Ongoing', type: 'TV', releaseDate: '', totalEpisodes: 0 });
        } catch (error) {
            alert("Error: " + (error.response?.data || error.message));
        }
    };

    // --- ЛОГІКА ВИДАЛЕННЯ (DELETE) ---
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this anime? This cannot be undone.")) return;
        
        try {
            // Викликаємо твій новий метод у контролері: [HttpDelete("{id}")]
            await api.delete(`/anime/${id}`);
            
            // Видаляємо аніме зі списку на екрані, щоб не перезавантажувати сторінку
            setAnimes(prev => prev.filter(a => a.id !== id));
            alert("Anime deleted.");
        } catch (error) {
            console.error("Delete failed:", error);
            // Якщо помилка 401/403 - значить юзер не Адмін або токен не передався
            alert("Failed to delete. Check console for details.");
        }
    };

    return (
        <div className="animate-fade-in text-white">
            {/* Заголовок і перемикач вкладок */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-heading font-bold">Manage Anime</h1>
                <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                    <button 
                        onClick={() => setActiveTab('list')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'list' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        List View
                    </button>
                    <button 
                        onClick={() => setActiveTab('create')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'create' ? 'bg-anime-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        + Create New
                    </button>
                </div>
            </div>

            {/* ВМІСТ: Або форма створення, або таблиця */}
            {activeTab === 'create' ? (
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-anime-accent">Create New Anime Entry</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Title</label>
                            <input required type="text" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-3 focus:border-anime-accent outline-none"
                                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                            <input required type="text" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-3 focus:border-anime-accent outline-none"
                                value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Description</label>
                            <textarea required rows="4" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-3 focus:border-anime-accent outline-none"
                                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Studio</label>
                            <input type="text" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-3 focus:border-anime-accent outline-none"
                                value={formData.studio} onChange={e => setFormData({...formData, studio: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Rating (Initial)</label>
                            <input type="number" step="0.1" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-3 focus:border-anime-accent outline-none"
                                value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Status</label>
                            <select className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-3 focus:border-anime-accent outline-none"
                                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                <option>Ongoing</option>
                                <option>Completed</option>
                                <option>Upcoming</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type</label>
                            <select className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-3 focus:border-anime-accent outline-none"
                                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                <option>TV</option>
                                <option>Movie</option>
                                <option>OVA</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Release Date</label>
                            <input required type="date" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-3 focus:border-anime-accent outline-none"
                                value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Total Episodes</label>
                            <input type="number" className="w-full bg-gray-900 border border-gray-600 rounded px-4 py-3 focus:border-anime-accent outline-none"
                                value={formData.totalEpisodes} onChange={e => setFormData({...formData, totalEpisodes: parseInt(e.target.value)})} />
                        </div>

                        <div className="md:col-span-2 mt-4">
                            <button type="submit" className="w-full bg-anime-accent py-4 rounded-lg font-bold hover:bg-red-600 transition text-lg shadow-lg shadow-red-900/40">
                                Create Anime
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                // ТАБЛИЦЯ СПИСКУ
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 text-gray-400 border-b border-gray-700 text-sm uppercase tracking-wider">
                                <th className="p-5">Image</th>
                                <th className="p-5">Title</th>
                                <th className="p-5">Status</th>
                                <th className="p-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading anime...</td></tr>
                            ) : animes.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">No anime found. Create one!</td></tr>
                            ) : (
                                animes.map(anime => (
                                    <tr key={anime.id} className="border-b border-gray-700 hover:bg-gray-700/30 transition group">
                                        <td className="p-4">
                                            <div className="w-16 h-24 rounded-lg overflow-hidden border border-gray-600 group-hover:border-anime-accent transition">
                                                <img src={anime.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-lg text-white">{anime.title}</div>
                                            <div className="text-xs text-gray-500">{anime.studio} • {new Date(anime.releaseDate).getFullYear()}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                anime.status === 'Ongoing' ? 'bg-green-900/50 text-green-400 border border-green-800' : 
                                                anime.status === 'Completed' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' :
                                                'bg-gray-700 text-gray-300'
                                            }`}>
                                                {anime.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                {/* КНОПКА ДОДАВАННЯ ЕПІЗОДІВ */}
                                                <Link to={`/admin/episodes/${anime.id}`}>
                                                    <button className="bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-600/30 px-4 py-2 rounded-lg transition text-sm font-bold flex items-center gap-2">
                                                        <span>+</span> Episodes
                                                    </button>
                                                </Link>
                                                
                                                {/* КНОПКА ВИДАЛЕННЯ */}
                                                <button 
                                                    onClick={() => handleDelete(anime.id)}
                                                    className="bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white border border-red-600/30 px-4 py-2 rounded-lg transition text-sm font-bold"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminAnimePage;