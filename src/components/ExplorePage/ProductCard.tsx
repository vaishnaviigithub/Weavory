"use client";
import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: any;
  openProductDetail: (product: any) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
}

const ProductCard = ({ product, openProductDetail, favorites, toggleFavorite }: ProductCardProps) => {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 transition-transform transform hover:scale-110"
        >
          <Heart className={`h-5 w-5 ${favorites.includes(product.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
        </button>
        
        {product.isFeatured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-md">
            Featured
          </div>
        )}
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <span className="px-4 py-2 bg-black/70 text-white font-medium rounded-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4 cursor-pointer" onClick={() => openProductDetail(product)}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="text-xs text-gray-600 ml-1">{product.rating} ({product.reviews})</span>
          </div>
          <p className="text-xs text-gray-500">By {product.weaver}</p>
        </div>
        <h3 className="text-base font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-900">₹{product.price.toLocaleString()}</p>
          <button 
            className={`px-3 py-1 text-xs font-medium rounded-full ${product.inStock 
              ? 'bg-orange-600 text-white hover:bg-orange-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;