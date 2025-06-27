"use client";

import React, { useState } from 'react';
import { Info } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const toggleInfoModal = () => {
    setShowInfoModal(!showInfoModal);
  };
  
  return (
    <>
    {/* Info Modal */}
    {showInfoModal && (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-lg w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">About Handloom Heritage</h3>
            <button onClick={toggleInfoModal} className="p-1 hover:bg-gray-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="prose">
            <p>India's handloom sector is the second-largest employment provider for rural populations after agriculture. With over 4.5 million people directly involved, handloom weaving represents living heritage and embodies India's cultural diversity.</p>
            <p>Each region has developed its unique weaving techniques, motifs, and styles, reflecting local cultural influences, climate, and available materials.</p>
            <p>By purchasing handloom products, you're supporting:</p>
            <ul>
              <li>Traditional artisans and their families</li>
              <li>Sustainable and eco-friendly production</li>
              <li>Preservation of cultural heritage</li>
              <li>Women's empowerment in rural communities</li>
            </ul>
            <p className="font-medium">Thank you for being part of this journey to sustain India's handloom traditions.</p>
          </div>
        </div>
      </div>
    )}
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image 
              src="/images/icons/thread.png" 
              alt="Weavory Logo"
              width={55}
              height={55}
              className="h-8 mb-4"
            />
            <p className="text-gray-400 text-sm">
              Connecting artisans with customers, preserving traditions, and celebrating India's handloom heritage.
            </p>
            <div className="mt-4">
                <button 
                  onClick={toggleInfoModal}
                  className="text-orange-400 hover:text-orange-300 flex items-center text-sm"
                >
                  <Info className="h-4 w-4 mr-1" />
                  Learn about our impact
                </button>
              </div>
            <div className="mt-4 flex space-x-6">
              {/* Social media icons would go here */}
            </div>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-medium mb-4"></h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white"></a></li>
                <li><a href="#" className="text-gray-400 hover:text-white"></a></li>
                <li><a href="#" className="text-gray-400 hover:text-white"></a></li>
                <li><a href="#" className="text-gray-400 hover:text-white"></a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">About</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">Our Mission</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">For Weavers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Sustainability</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white"></a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Help</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">Customer Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Shipping & Returns</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 Weavory. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;