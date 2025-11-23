import React, { useState } from 'react';
import { heroSlides } from '../data/mockData'; // Використовуємо статичні дані
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react'; 

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const currentSlide = heroSlides[activeIndex];

  return (
    <div className="relative h-screen w-full overflow-hidden text-white bg-anime-dark">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={currentSlide.image} 
          alt="Background" 
          className="w-full h-full object-cover transition-all duration-700 ease-in-out opacity-60"
        />
        {/* Градієнт щоб текст читався */}
        <div className="absolute inset-0 bg-gradient-to-r from-anime-dark via-anime-dark/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-anime-dark via-transparent to-black/40"></div>
      </div>

      {/* Content Grid */}
      <div className="relative z-10 container mx-auto px-8 h-full flex flex-col justify-center md:flex-row md:items-center">
        
        {/* Left Side: Text Info */}
        <div className="md:w-1/2 space-y-6 mt-20 md:mt-0">
          <h1 className="font-heading text-6xl md:text-8xl font-black uppercase leading-tight tracking-tighter drop-shadow-2xl">
            {currentSlide.title}
          </h1>
          
          <p className="text-gray-300 max-w-md text-sm md:text-base leading-relaxed border-l-4 border-anime-accent pl-6 bg-black/20 p-2 rounded-r-lg backdrop-blur-sm">
            {currentSlide.description}
          </p>

          <div className="flex items-center gap-4 pt-4">
            <button className="p-3 rounded-full border border-gray-500 hover:bg-white hover:text-black transition group">
              <Bookmark size={20} className="group-hover:fill-black" />
            </button>
            <button className="px-8 py-3 rounded-full border border-white text-white uppercase text-sm tracking-widest hover:bg-white hover:text-black transition font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Explore Blogs
            </button>
          </div>
        </div>

        {/* Right Side: Carousel Cards */}
        <div className="md:w-1/2 flex flex-col justify-end h-full pb-10 md:pb-20 pl-0 md:pl-10">
            <p className="text-anime-accent font-bold text-sm mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-anime-accent rounded-full animate-pulse"></span> featured anime
            </p>
            
            {/* ВИПРАВЛЕННЯ ТУТ:
               Added 'py-8' (padding vertical) - дає простір для scale, щоб border не різався.
               Added 'px-2' - невеликий відступ по боках.
            */}
            <div className="flex gap-4 overflow-x-auto py-8 px-2 scrollbar-hide" style={{scrollbarWidth: 'none'}}>
            {heroSlides.map((slide, index) => (
                <div 
                key={slide.id}
                onClick={() => setActiveIndex(index)}
                className={`
                    relative flex-shrink-0 w-32 h-48 md:w-40 md:h-60 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 
                    ${index === activeIndex 
                        ? 'border-anime-accent scale-110 z-10 shadow-[0_0_20px_rgba(255,77,77,0.6)]' // Активний: світіння + збільшення
                        : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105 hover:border-gray-500'} // Неактивний
                `}
                >
                <img src={slide.image} alt={slide.short} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent p-3">
                    <span className="font-heading text-xl font-bold uppercase text-white drop-shadow-md">{slide.short}</span>
                </div>
                </div>
            ))}
            </div>

            {/* Controls & Progress */}
            <div className="flex items-center gap-6 mt-2">
                <div className="flex gap-3">
                    <button onClick={prevSlide} className="p-3 border border-gray-600 rounded-full hover:border-anime-accent hover:text-anime-accent transition hover:bg-white/10">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextSlide} className="p-3 border border-gray-600 rounded-full hover:border-anime-accent hover:text-anime-accent transition hover:bg-white/10">
                        <ChevronRight size={20} />
                    </button>
                </div>
                
                <div className="flex-1 h-[2px] bg-gray-700 relative mx-4 rounded-full overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 h-full bg-white transition-all duration-500 ease-out shadow-[0_0_10px_white]"
                        style={{ width: `${((activeIndex + 1) / heroSlides.length) * 100}%` }}
                    ></div>
                </div>

                <span className="font-heading text-3xl font-bold text-gray-500 select-none">
                    {String(activeIndex + 1).padStart(2, '0')}
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;