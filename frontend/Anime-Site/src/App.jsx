import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import AnimeDetailsPage from './pages/AnimeDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage'; // <-- ІМПОРТ ПРОФІЛЮ

// Створюємо компонент для Головної сторінки
const HomePage = () => (
  <>
    <Hero />
    <MainContent />
  </>
);

function App() {
  return (
    <div className="bg-anime-dark min-h-screen text-white font-sans flex flex-col">
      {/* Navbar і Footer на всіх сторінках */}
      <Navbar />
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime/:id" element={<AnimeDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* <-- МАРШРУТ ПРОФІЛЮ */}
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;