"use client";
import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';

interface ProductDetailModalProps {
  product: any;
  closeProductDetail: () => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  addToCart: (product: any) => void;
}

const ProductDetailModal = ({
  product,
  closeProductDetail,
  favorites,
  toggleFavorite,
  addToCart
}: ProductDetailModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">{product.name}</h3>
          <button onClick={closeProductDetail} className="p-1 hover:bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-96">
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 ml-2">{product.rating} ({product.reviews} reviews)</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-4">₹{product.price.toLocaleString()}</p>
              <p className="text-gray-700 mb-4">Crafted by <span className="font-medium">{product.weaver}</span></p>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Product Details</h4>
                <p className="text-gray-600">This exquisite handcrafted piece represents centuries of tradition and skill. Each thread is carefully selected and woven using techniques passed down through generations.</p>
              </div>
              
              <div className="mb-6">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  className={`px-6 py-3 rounded-lg font-medium flex-1 ${product.inStock ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  disabled={!product.inStock}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => toggleFavorite(product.id)} 
                  className={`p-3 rounded-lg border ${favorites.includes(product.id) ? 'bg-pink-50 border-pink-500 text-pink-500' : 'border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;