import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Імпорт для навігації
import api from '../api/axios'; // Твій налаштований axios
import { topAnime } from '../data/mockData'; // Топ поки статичний (або видали, якщо не треба)

const MainContent = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        // Запит до твого контролера: api/anime
        const response = await api.get('/anime?page=1&pageSize=20'); 
        
        console.log("Response from server:", response.data);

        // Обробка PagedResponse (Items або items)
        const data = response.data;
        const animes = data.items || data.Items || []; 
        
        setAnimeList(animes);
      } catch (err) {
        console.error("Error fetching anime:", err);
        setError("Failed to load anime. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  return (
    <div className="bg-anime-dark text-white py-16 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* --- SIDEBAR (Left 1/3) --- */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
            <h3 className="font-heading text-2xl border-b border-gray-800 pb-2 mb-4">Top Rated</h3>
            <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 backdrop-blur-sm">
                {topAnime.map((anime, index) => (
                    <div key={anime.id} className="flex items-center gap-4 mb-4 last:mb-0 p-2 hover:bg-white/5 rounded-lg transition cursor-pointer group">
                        <span className={`font-heading text-2xl w-8 text-center ${index < 3 ? 'text-anime-accent' : 'text-gray-500'}`}>
                            {index + 1}
                        </span>
                        <div className="flex-1">
                            <h4 className="font-bold group-hover:text-anime-accent transition">{anime.title}</h4>
                            <span className="text-xs text-gray-400">Rating: {anime.rating}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- MAIN CONTENT (Right 2/3) --- */}
        <div className="md:col-span-8 lg:col-span-9">
            <div className="flex justify-between items-end mb-6 border-b border-gray-800 pb-2">
                <h3 className="font-heading text-2xl">Latest Updates</h3>
            </div>

            {loading ? (
               <div className="flex justify-center items-center py-20">
                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-anime-accent"></div>
               </div>
            ) : error ? (
                <div className="text-red-400 text-center py-10 border border-red-900/50 rounded bg-red-900/10">
                    <p className="font-bold text-lg">Connection Error</p>
                    <p className="text-sm mt-2">{error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {animeList.length > 0 ? (
                        animeList.map((item) => (
                        <div key={item.id} className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-anime-accent/50 transition hover:-translate-y-1 relative shadow-lg shadow-black/50 flex flex-col h-full">
                            
                            {/* Картинка з посиланням */}
                            <Link to={`/anime/${item.id}`} className="block h-64 overflow-hidden relative cursor-pointer">
                                <img 
                                    src={item.imageUrl || "https://placehold.co/400x600?text=No+Image"} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    onError={(e) => {e.target.src="https://placehold.co/400x600?text=Error"}} 
                                />
                                
                                {/* Rating Badge */}
                                {item.rating > 0 && (
                                    <div className="absolute top-2 right-2 bg-anime-accent text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                                        ★ {item.rating}
                                    </div>
                                )}

                                {/* Episodes Badge */}
                                {item.totalEpisodes !== null && (
                                    <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded border border-gray-700">
                                        {item.totalEpisodes} EP
                                    </div>
                                )}
                            </Link>
                            
                            <div className="p-4 flex flex-col flex-grow">
                                {/* Title з посиланням */}
                                <Link to={`/anime/${item.id}`}>
                                    <h4 className="font-bold text-lg truncate text-white group-hover:text-anime-accent transition mb-1" title={item.title}>
                                        {item.title}
                                    </h4>
                                </Link>
                                
                                <div className="flex justify-between items-center mt-2 text-xs text-gray-500 mb-3">
                                    <span className="truncate max-w-[50%]">{item.studio || "Studio N/A"}</span>
                                    <span className="border border-gray-700 px-2 py-0.5 rounded text-gray-400 uppercase text-[10px]">
                                        {item.type || "TV"}
                                    </span>
                                </div>

                                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mt-auto">
                                    {item.description || "No description available."}
                                </p>
                            </div>
                        </div>
                    ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No anime found.
                        </div>
                    )}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default MainContent;