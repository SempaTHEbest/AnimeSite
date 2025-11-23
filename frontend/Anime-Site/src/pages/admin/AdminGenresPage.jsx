import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminGenresPage = () => {
    const [genres, setGenres] = useState([]);
    const [newGenreName, setNewGenreName] = useState('');
    const [loading, setLoading] = useState(true);

    // Завантаження жанрів
    const fetchGenres = async () => {
        try {
            const response = await api.get('/genre');
            setGenres(response.data);
        } catch (error) {
            console.error("Error loading genres", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    // Створення жанру
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newGenreName.trim()) return;

        try {
            await api.post('/genre', { name: newGenreName });
            setNewGenreName('');
            fetchGenres(); // Оновлюємо список
            alert("Genre added!");
        } catch (error) {
            alert("Failed to add genre: " + error.message);
        }
    };

    // Видалення жанру
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this genre?")) return;
        
        try {
            await api.delete(`/genre/${id}`);
            setGenres(genres.filter(g => g.id !== id));
        } catch (error) {
            alert("Failed to delete genre");
        }
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-heading font-bold mb-8">Manage Genres</h1>

            {/* CREATE FORM */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
                <h3 className="text-xl font-bold mb-4">Add New Genre</h3>
                <form onSubmit={handleCreate} className="flex gap-4">
                    <input 
                        type="text" 
                        value={newGenreName}
                        onChange={(e) => setNewGenreName(e.target.value)}
                        placeholder="e.g. Action, Isekai..."
                        className="flex-1 bg-gray-900 border border-gray-600 rounded px-4 py-2 text-white focus:border-anime-accent focus:outline-none"
                    />
                    <button type="submit" className="bg-anime-accent px-6 py-2 rounded font-bold hover:bg-red-600 transition">
                        Add Genre
                    </button>
                </form>
            </div>

            {/* LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {genres.map(genre => (
                    <div key={genre.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center group">
                        <span className="font-medium text-lg">{genre.name}</span>
                        <button 
                            onClick={() => handleDelete(genre.id)}
                            className="text-gray-500 hover:text-red-500 transition px-2 py-1 rounded hover:bg-red-900/20"
                        >
                            🗑 Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminGenresPage;