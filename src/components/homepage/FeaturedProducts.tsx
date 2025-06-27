import React from 'react';
import { Heart, Star, ChevronRight } from 'lucide-react';

const FeaturedProducts = ({ featuredProducts, addToCart }) => {
  const getImageUrl = (images) => {
    if (!images) return null;
    
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
      } catch (e) {
        return images.startsWith('http') ? images : null;
      }
    }
    
    if (Array.isArray(images) && images.length > 0) {
      return images[0];
    }
    
    return null;
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <a href="#" className="text-orange-600 hover:text-orange-700 font-medium flex items-center">
              View All <ChevronRight className="ml-1 h-5 w-5" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts && featuredProducts.map((product) => {
              console.log("Product image data:", product.images);
              
              const imageUrl = getImageUrl(product.images);
              console.log("Extracted image URL:", imageUrl);
              
              return (
                <div key={product.id || Math.random()} className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  <div className="relative h-80 w-full overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name || "Product"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{product.name || "Unnamed Product"}</h3>
                        <p className="text-sm text-gray-500">{product.origin || "Unknown origin"}</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-700">{product.rating || "N/A"}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{(product.price !== undefined && product.price !== null) 
                          ? Number(product.price).toLocaleString() 
                          : '0'}
                      </p>
                      <button 
                        onClick={() => addToCart(product)}
                        className="px-3 py-1 bg-amber-800 text-white text-sm font-medium rounded-full hover:bg-orange-700"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;