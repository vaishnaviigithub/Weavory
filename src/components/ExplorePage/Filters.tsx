"use client";
import React from 'react';

interface FiltersProps {
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
}

const Filters = ({ activeFilters, toggleFilter }: FiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => toggleFilter('inStock')}
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          activeFilters.includes('inStock') 
            ? 'bg-orange-100 text-orange-800 border border-orange-300' 
            : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
        }`}
      >
        In Stock Only
      </button>
      <button
        onClick={() => toggleFilter('featured')}
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          activeFilters.includes('featured') 
            ? 'bg-orange-100 text-orange-800 border border-orange-300' 
            : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
        }`}
      >
        Featured Products
      </button>
    </div>
  );
};

export default Filters;