"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const features = [
  {
    icon: "🧵",
    title: "Authentic Handloom",
    description: "Every product on our platform is crafted by verified artisans using traditional techniques.",
    bgImage: "/images/handloom-pattern-1.jpg", 
    iconAlt: "Traditional loom icon"
  },
  {
    icon: "🌎",
    title: "Direct from Weavers",
    description: "Skip the middlemen and connect directly with the creators behind your favorite textiles.",
    bgImage: "/images/handloom-pattern-2.jpg",
    iconAlt: "Artisan weaving traditional fabric"
  },
  {
    icon: "🎭",
    title: "Virtual Handloom Fairs",
    description: "Experience the culture and craftsmanship through interactive virtual exhibitions.",
    bgImage: "/images/handloom-pattern-3.jpg",
    iconAlt: "Traditional textile showcase"
  },
  {
    icon: "📱",
    title: "Tech Support for Weavers",
    description: "We help traditional artisans navigate technology and reach global customers.",
    bgImage: "/images/handloom-pattern-4.jpg",
    iconAlt: "Weaver using technology"
  }
];

// Authentic pattern backgrounds as CSS values (fallbacks if images aren't available)
const patternBgs = [
  "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23a97c50\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
  "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('data:image/svg+xml,%3Csvg width=\"52\" height=\"26\" viewBox=\"0 0 52 26\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23a97c50\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\" /%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
  "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('data:image/svg+xml,%3Csvg width=\"100\" height=\"20\" viewBox=\"0 0 100 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M21.184 20c.357-.13.72-.264.888-.14 1.255-.874 1.452-2.237.6-3.27-1.425-1.723-3.654-2.073-5.63-.95-1.63.904-2.29 2.58-2.028 4.23.15 1.238.78 2.04 1.74 2.75 1.25.868 2.59 1.17 3.95.72zm-7.63-1.17c.9-.486 1.764-1.086 2.412-1.896 1.303-1.63 1.34-3.756.106-5.32-1.336-1.698-3.656-2.058-5.54-.878-1.685.727-2.443 2.61-2.15 4.347.15 1.16.788 2.07 1.82 2.687 1.504.899 2.388 1.03 3.35 1.06zm27.26-11.14c-1.503-.33-2.987.25-4.16 1.44-1.08 1.083-1.54 2.328-1.498 3.787.037 1.31.63 2.274 1.537 3.258 1.4 1.514 3.304 1.657 5.05.876.85-.38 1.622-.98 2.18-1.765 1.42-2.013 1.357-4.635-.148-6.483-.87-1.07-1.906-1.466-2.96-1.114zm12.655 11.585c-.168.164-.346.325-.56.455-1.56.94-3.474.734-4.878-.554-1.365-1.25-1.732-2.864-1.316-4.543.344-1.367 1.161-2.404 2.505-3.07 1.934-.954 4.07-.503 5.422 1.108.617.74.98 1.66 1.104 2.556.11.746.034 1.505-.18 2.207-.268.89-.75 1.57-2.097 1.84zm-21.803-4.602c-1.593-.43-3.212-.14-4.47.838-1.862 1.434-2.365 3.684-1.238 5.693.71 1.265 1.744 2.083 3.145 2.435 1.955.49 3.74-.18 5.077-1.788 1.48-1.772 1.467-4.316-.035-6.082-.744-.876-1.597-1.05-2.48-1.095zm29.956 5.676c.064 1.872-.598 3.025-2.156 3.67-1.693.702-3.396.37-4.878-.685-1.455-1.036-2.15-2.435-2.162-4.174-.015-1.5.605-2.778 1.825-3.793 1.888-1.576 4.558-1.365 6.34.55 1.36 1.462 1.128 2.718 1.03 4.43zm-12.75-3.58c-.757.924-1.188 1.932-1.215 3.086-.032 1.38.464 2.604 1.51 3.616 1.5 1.448 3.412 1.817 5.35 1.113 1.81-.66 3.062-2.82 2.543-4.917-.296-1.192-1.074-2.098-2.024-2.857-1.7-1.356-4.25-1.416-6.166-.04zm-6.723.15c-.1.004-.097.01-.196.016-2.04.673-3.3 2.372-3.206 4.436.1 2.09 1.464 3.8 3.4 4.214 2.116.458 4.22-.56 5.206-2.5.388-.757.54-1.56.52-2.397-.033-1.437-.585-2.622-1.694-3.572-1.33-1.14-2.832-1.22-4.032-.196zM57.268 3.822c.908-.162 1.966-.332 2.33.4-.134 1.44-.187 2.9-.217 4.36-.022 1.024.32 2.047.134 3.07-.245 1.35-.5 2.7-.76 4.04-1.03.17-1.972.27-2.936.566-.748.23-1.58.818-2.267.595-.58-.188-.95-1.472-1.06-2.22-.716-4.82-.66-9.73.165-14.53.206-1.18 3.32-.84 4.61-.28z\" fill=\"%23a97c50\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
  "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"88\" height=\"24\" viewBox=\"0 0 88 24\"%3E%3Cg fill-rule=\"evenodd\"%3E%3Cg id=\"autumn\" fill=\"%23a97c50\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M10 0l30 15 2 1V2.18A10 10 0 0 0 41.76 0H39.7a8 8 0 0 1 .3 2.18v10.58L14.47 0H10zm31.76 24a10 10 0 0 0-5.29-6.76L4 1 2 0v13.82a10 10 0 0 0 5.53 8.94L10 24h4.47l-6.05-3.02A8 8 0 0 1 4 13.82V3.24l31.58 15.78A8 8 0 0 1 39.7 24h2.06zM78 24l2.47-1.24A10 10 0 0 0 86 13.82V0l-2 1-32.47 16.24A10 10 0 0 0 46.24 24h2.06a8 8 0 0 1 4.12-4.98L84 3.24v10.58a8 8 0 0 1-4.42 7.16L73.53 24H78zm0-24L48 15l-2 1V2.18A10 10 0 0 1 46.24 0h2.06a8 8 0 0 0-.3 2.18v10.58L73.53 0H78z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
];

// Custom icons with cultural significance (instead of emojis)
const customIcons = [
  '/images/icons/HANDLOOM.webp', // Weaving loom icon
  '/images/icons/authentic.webp', // Artisan weaver icon
  '/images/icons/fair.png', // Cultural exhibition icon  
  '/images/icons/support.webp' // Tech-enabled weaving icon
];


const FeatureSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-rotate by default
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate positions and rotations for each card
  const getCardStyle = (index: number) => {
    // Normalize the index relative to current card
    const diff = (index - currentIndex + features.length) % features.length;
    
    // Map the diff to a position in the circle
    const angle = (diff / features.length) * 2 * Math.PI;
    
    // Map the angle to a position in 3D space
    const z = Math.cos(angle) * 200;
    const x = Math.sin(angle) * 350;
    const rotateY = -angle * (180 / Math.PI);
    
    // Calculate opacity based on z position (cards in front are more visible)
    const opacity = (z + 200) / 400;
    const scale = (z + 350) / 550;
    
    return {
      zIndex: Math.round(z) + 100,
      opacity,
      scale,
      x,
      z,
      rotateY
    };
  };
  
  const handleCardClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="features" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4 text-amber-800">
            Why Choose Weavory?
          </h2>
          <p className="text-lg text-amber-900 max-w-3xl mx-auto font-body">
            We're not just a marketplace - we're building a bridge between tradition and technology.
          </p>
        </div>
      
        <div className="relative h-96 md:h-[450px] flex items-center justify-center">
          <div 
            className="scene relative h-72 md:h-80 w-full max-w-5xl mx-auto"
            style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
          >
            {features.map((feature, index) => {
              const style = getCardStyle(index);
              
              return (
                <motion.div
                  key={index}
                  className="absolute top-0 left-0 right-0 mx-auto w-72 md:w-96 h-72 md:h-80 cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{
                    x: style.x,
                    z: style.z,
                    rotateY: style.rotateY,
                    scale: style.scale,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 1
                  }}
                  onClick={() => handleCardClick(index)}
                  whileHover={{ scale: style.scale * 1.05 }}
                >
                  <div 
                    className="w-full h-full rounded-2xl p-8 shadow-x1 flex flex-col overflow-hidden relative border border-amber-200"
                    style={{ 
                      backfaceVisibility: "hidden",
                      background: index === currentIndex 
                        ? `linear-gradient(rgba(255, 252, 245, 0.85), rgba(255, 252, 245, 0.85)), url('/api/placeholder/400/300')`
                        : patternBgs[index % patternBgs.length],
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "1rem"
                    }}
                  >
                    {/* Border decoration resembling handloom patterns */}
                    <div className="absolute inset-0 border-4 border-transparent pointer-events-none" 
                      style={{
                        borderImage: "linear-gradient(45deg, #a97c50, #d4b483, #a97c50, #d4b483) 1",
                        borderImageSlice: "1"
                      }}
                    ></div>
                    
                    <div className="text-center relative z-10">
                      <div className="mb-4 inline-block bg-amber-50 rounded-full border border-amber-100 shadow-sm">
                        {/* Replace emoji with custom icon or fallback SVG */}
                        <Image src={customIcons[index]} width={80} height={80} className="w-20 h-20 object-cover rounded-full" alt={feature.iconAlt} />
                      </div>
                      <h3 className="text-xl font-heading font-bold mb-3 text-amber-900">
                        {feature.title}
                      </h3>
                    </div>
                    
                    <div className="flex-1 flex items-center relative z-10">
                      <p className="text-amber-800 text-center font-body">
                        {feature.description}
                      </p>
                    </div>
                    
                    {index === currentIndex && (
                      <div className="mt-4 pt-3 border-t border-amber-100 text-center">
                        <span className="text-amber-600 text-sm font-medium">Learn More</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-10 flex justify-center gap-3">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentIndex === index ? "bg-amber-600" : "bg-amber-200"
              }`}
              aria-label={`View feature ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;