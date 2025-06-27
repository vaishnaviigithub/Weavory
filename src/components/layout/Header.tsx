"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          <Image 
            src="/images/icons/logo2.png" 
            alt="Weavory Logo"
            width={130}
            height={130}
          />
        </motion.div>

        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {['Home', 'About', 'Features', 'Contact'].map((item) => (
              <motion.li 
                key={item}
                whileHover={{ scale: 1.1 }}
                className={`cursor-pointer ${scrolled ? 'text-accent-dark' : 'text-white'} font-body`}
                onClick={() => handleScrollToSection(item.toLowerCase())}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="flex space-x-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            className={`px-4 py-2 rounded-md ${
              scrolled 
                ? 'bg-primary text-white' 
                : 'bg-white text-primary'
            } font-body font-medium`}
            onClick={() => router.push('/sign-in')}
          >
            Sign In
          </motion.button>
          {isClient && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-md ${
                scrolled 
                  ? 'border border-primary text-primary' 
                  : 'border border-white text-white'
              } font-body font-medium`}
              onClick={() => router.push('/register')}
            >
              Register
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;