"use client";
import React from 'react';
import { ArrowLeft, Users, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Filters from './Filters';
import ProductCard from './ProductCard';

interface CategoryDetailProps {
  states: any[];
  selectedCategory: any;
  goBack: () => void;
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
  getFilteredProducts: () => any[];
  openProductDetail: (product: any) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  setSearchQuery: (query: string) => void;
  setActiveFilters: (filters: string[]) => void;
}

const CategoryDetail = ({
  states,
  selectedCategory,
  goBack,
  activeFilters,
  toggleFilter,
  getFilteredProducts,
  openProductDetail,
  favorites,
  toggleFavorite,
  setSearchQuery,
  setActiveFilters
}: CategoryDetailProps) => {
  return (
    <div>
      <button onClick={goBack} className="flex items-center text-orange-600 hover:text-orange-800 mb-6 group">
        <ArrowLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Categories
      </button>
      
      <div className="mb-12">
        <div className="relative h-80 rounded-xl overflow-hidden mb-8">
          <Image
            src={states[selectedCategory.state].categories[selectedCategory.category].featuredImage}
            alt={states[selectedCategory.state].categories[selectedCategory.category].name}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <div className="flex items-center mb-2">
              <span className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full mr-2">
                {states[selectedCategory.state].name}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                {states[selectedCategory.state].categories[selectedCategory.category].heritage}
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {states[selectedCategory.state].categories[selectedCategory.category].name}
            </h2>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Supporting {states[selectedCategory.state].categories[selectedCategory.category].weaverCount.toLocaleString()} artisans
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">About this craft</h3>
          <p className="text-gray-700">
            {states[selectedCategory.state].categories[selectedCategory.category].description}
          </p>
        </div>
        
        <Filters activeFilters={activeFilters} toggleFilter={toggleFilter} />
        
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Products</h3>
            <span className="text-sm text-gray-500">
              {getFilteredProducts().length} products found
            </span>
          </div>
          
          {getFilteredProducts().length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No products found</h4>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilters([]);
                }}
                className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getFilteredProducts().map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  openProductDetail={openProductDetail}
                  favorites={favorites}
                  toggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;