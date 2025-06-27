"use client";

import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/navigation';

const FlowingSaree = () => {
  const controls = useAnimation();
  const router = useRouter();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });


  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0,
      x: 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  // Traditional motif pattern used in sarees (simplified)
  const PatternOverlay = () => (
    <div className="absolute inset-0 opacity-5">
      <div className="w-full h-full" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 L20 0 L0 20 Z M20 20 L40 20 L20 40 Z M20 20 L0 20 L20 0 Z M20 20 L20 40 L40 20 Z' fill='%23DAA520' fill-opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px'
      }} />
    </div>
  );

  return (
    <section id="about" ref={ref} className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <PatternOverlay />
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-700 via-red-800 to-amber-700" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate={controls}
            className="space-y-6"
          >
            <motion.div variants={childVariants} className="inline-block mb-2">
              <div className="flex items-center gap-2">
                <div className="h-px w-12 bg-amber-800"></div>
                <span className="text-amber-800 text-sm font-medium tracking-wider uppercase">Heritage Craft</span>
              </div>
            </motion.div>
            
            <motion.h2 
              variants={childVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
            >
              Centuries of Handloom <br className="hidden md:block" />
              <span className="text-amber-800">at Your Fingertips</span>
            </motion.h2>
            
            <motion.p 
              variants={childVariants}
              className="text-base md:text-lg text-gray-700"
            >
              Each piece tells a story of tradition passed down through generations. <br />
              Our platform connects you directly with artisans who pour their heritage
              and skills into every thread, sustaining ancient weaving techniques.
              <br />
            </motion.p>
            
            <motion.div variants={childVariants} className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-amber-800 text-white font-medium rounded hover:bg-amber-900 
                         transition-colors duration-200 shadow-md"
                onClick={() => router.push('/register')}
              >
                Discover the Craft
              </motion.button>
            </motion.div>
            
          </motion.div>
          
          <motion.div
            className="relative"
            variants={imageVariants}
            initial="hidden"
            animate={controls}
          >
            <div className="relative h-[500px] rounded-md overflow-hidden shadow-lg border border-amber-100">
              {/* Main saree image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/sarees/saree.jpg')"
                }}
              />
              
              {/* Traditional border overlay */}
              <div className="absolute inset-0 border-8 border-transparent rounded-md" style={{
                backgroundImage: 'linear-gradient(transparent, transparent), linear-gradient(to right, rgba(217, 119, 6, 0.2), rgba(153, 27, 27, 0.2))',
                backgroundOrigin: 'border-box',
                backgroundClip: 'content-box, border-box',
              }} />
              
              {/* Subtle light effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-amber-900/10 to-transparent"
                animate={{
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              
              {/* Information card */}
              <motion.div
                className="absolute bottom-6 -left-6 bg-white p-4 rounded shadow-md border-l-4 border-amber-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.5, duration: 0.5 }
                }}
              >
                <div className="flex items-start space-x-2">
                  <div className="p-1 bg-amber-100 rounded">
                    <svg className="w-4 h-4 text-amber-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-900">GI Tagged Product</h3>
                    <p className="text-xs text-gray-600">Authentic Banarasi handloom</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FlowingSaree;