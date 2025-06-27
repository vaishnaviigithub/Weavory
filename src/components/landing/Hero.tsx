"use client";

// src/components/landing/Hero.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Hero: React.FC = () => {
    const router = useRouter();
  
  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-accent-dark opacity-60"></div>
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/bgvidd.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <motion.h1
            className="text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Weaving <span className="text-secondary">Tradition</span> into the Digital Age
          </motion.h1>
          
          <motion.p
            className="text-xl text-white/90 mb-8 font-body"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Connect directly with master artisans from across India and discover handcrafted textiles with stories woven into every thread.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary text-white font-body font-medium rounded-md shadow-lg"
              onClick={() => router.push('/register')}
            >
              Explore Products
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white text-primary font-body font-medium rounded-md shadow-lg"
              onClick={() => router.push('/register')}
            >
              Join as a Weaver
            </motion.button>
          </motion.div>
        </div>
      </div>
      
      {/* Scrolldown indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ 
          y: [0, 10, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 1.5
        }}
      >
        <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;