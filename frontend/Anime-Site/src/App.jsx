import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import AnimeDetailsPage from './pages/AnimeDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AnimeWatchPage from './pages/AnimeWatchPage'; // <-- ВАЖЛИВО: Імпорт нової сторінки

// --- ADMIN IMPORTS ---
import AdminLayout from './pages/admin/AdminLayout';
import AdminAnimePage from './pages/admin/AdminAnimePage';
import AdminGenresPage from './pages/admin/AdminGenresPage';
import AdminEpisodesPage from './pages/admin/AdminEpisodesPage';

// Компонент головної сторінки
const HomePage = () => (
  <>
    <Navbar />
    <Hero />
    <MainContent />
    <Footer />
  </>
);

// Обгортка для публічних сторінок (Navbar + Footer)
const PublicLayout = ({ children }) => (
    <div className="bg-anime-dark min-h-screen text-white font-sans flex flex-col">
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
    </div>
);

function App() {
  return (
    <Routes>
      {/* ПУБЛІЧНІ МАРШРУТИ */}
      <Route path="/" element={<HomePage />} />
      
      <Route path="/anime/:id" element={<PublicLayout><AnimeDetailsPage /></PublicLayout>} />
      
      {/* НОВИЙ МАРШРУТ ДЛЯ ПЕРЕГЛЯДУ */}
      <Route path="/anime/:id/watch" element={<PublicLayout><AnimeWatchPage /></PublicLayout>} />
      
      <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
      <Route path="/profile" element={<PublicLayout><ProfilePage /></PublicLayout>} />

      {/* АДМІН МАРШРУТИ (ТЕСТОВИЙ РЕЖИМ) */}
      <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<div className="text-white text-2xl p-8">Welcome to Admin Panel (Test Mode)</div>} />
          <Route path="anime" element={<AdminAnimePage />} />
          <Route path="genres" element={<AdminGenresPage />} />
          <Route path="episodes/:animeId" element={<AdminEpisodesPage />} />
      </Route>

    </Routes>
  );
}

export default App;