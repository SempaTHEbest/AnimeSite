import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, updateUserLocal } = useAuth();
    
    // Початкові значення
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Відправляємо на сервер
            await api.put('/users/profile', {
                avatarUrl: avatarUrl,
                bio: bio
            });

            // 2. Оновлюємо миттєво в браузері
            if (updateUserLocal) {
                updateUserLocal({ avatarUrl, bio });
            } else {
                window.location.reload();
            }
            
            onClose();
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in px-4">
            <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">✕</button>
                
                <h2 className="text-2xl font-heading font-bold text-white mb-6">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Preview */}
                    <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-anime-accent bg-gray-800">
                            <img 
                                src={avatarUrl || `https://ui-avatars.com/api/?name=${user?.username}&background=1f2937&color=fff`} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${user?.username}&background=1f2937&color=fff`}
                            />
                        </div>
                    </div>

                    {/* Inputs */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Avatar Image URL</label>
                        <input 
                            type="text" 
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-anime-accent outline-none"
                            placeholder="https://..."
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Bio</label>
                        <textarea 
                            rows="4"
                            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-anime-accent outline-none resize-none"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        ></textarea>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-anime-accent text-white font-bold py-3 rounded-lg hover:bg-red-600 transition">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;