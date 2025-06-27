import React from 'react';
import { Map, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const VirtualFairs = ({ upcomingFairs }) => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Virtual Handloom Fairs
            </h2>
            <a href="#" className="text-orange-600 hover:text-orange-700 font-semibold flex items-center">
              View Calendar <ChevronRight className="ml-1 h-5 w-5" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingFairs.map((fair) => (
              <div key={fair.id} className="relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
                <Image src={fair.image} alt={fair.title} width={300} height={200} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <div className="text-sm font-medium text-amber-800">{fair.date}</div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{fair.title}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-gray-500 flex items-center">
                      <Map className="h-4 w-4 mr-1" />
                      {fair.location}
                    </div>
                    <button className="px-4 py-1 text-sm font-medium text-amber-800 border border-amber-600 rounded-full hover:bg-orange-50">
                      Remind Me
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualFairs;