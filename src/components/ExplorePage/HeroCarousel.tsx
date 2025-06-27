"use client";
import React from 'react';
import Image from 'next/image';

interface HeroCarouselProps {
  heroImages: Array<{ src: string; alt: string; title: string }>;
  heroImageIndex: number;
  setHeroImageIndex: (index: number) => void;
}

const HeroCarousel = ({ heroImages, heroImageIndex, setHeroImageIndex }: HeroCarouselProps) => {
  return (
    <div className="relative h-96 mb-12 rounded-xl overflow-hidden shadow-xl">
      {heroImages.map((image, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === heroImageIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{image.title}</h1>
            <p className="text-xl max-w-lg">Experience the timeless beauty of India's handloom traditions</p>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setHeroImageIndex(index)}
            className={`w-3 h-3 rounded-full ${index === heroImageIndex ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;