import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-12 border-t border-gray-900">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4">
          <h2 className="font-heading text-2xl text-white tracking-wider">TOKYO CALLING</h2>
          <p className="text-sm leading-relaxed">
            Your ultimate destination for anime streaming, news, and community discussions.
          </p>
        </div>

        {/* Links 1 */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-anime-accent cursor-pointer">Browse Anime</li>
            <li className="hover:text-anime-accent cursor-pointer">Manga Library</li>
            <li className="hover:text-anime-accent cursor-pointer">Simulcasts</li>
          </ul>
        </div>

        {/* Links 2 */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Community</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-anime-accent cursor-pointer">Discord Server</li>
            <li className="hover:text-anime-accent cursor-pointer">Blog & News</li>
            <li className="hover:text-anime-accent cursor-pointer">Merch Store</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Stay Updated</h4>
          <div className="flex flex-col gap-2">
            <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-900 border border-gray-800 rounded px-4 py-2 focus:outline-none focus:border-anime-accent text-white"
            />
            <button className="bg-anime-accent text-white px-4 py-2 rounded font-bold hover:bg-red-600 transition">
                Subscribe
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-center text-xs mt-12 pt-8 border-t border-gray-900">
        © 2024 Tokyo Calling. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;