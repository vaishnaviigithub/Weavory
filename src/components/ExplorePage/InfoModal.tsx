"use client";
import React from 'react';

interface InfoModalProps {
  toggleInfoModal: () => void;
}

const InfoModal = ({ toggleInfoModal }: InfoModalProps) => {
  return (
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
  );
};

export default InfoModal;