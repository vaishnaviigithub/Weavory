"use client";

import React, { useState, useEffect } from 'react';
import { 
  Pencil, 
  Trash2, 
  Package, 
  Search, 
  Filter, 
  ChevronDown,
  Eye, 
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { getWeaverProducts, deleteProduct, updateProduct } from '@/lib/weaverService';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';

const ProductsList = ({ initialProducts = [] }: { initialProducts?: Product[] }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  useEffect(() => {
    const loadProducts = async () => {
      if (user?.id) {
        try {
          const fetchedProducts = await getWeaverProducts(user.id);
          setProducts(fetchedProducts);
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading products:', error);
          setIsLoading(false);
        }
      }
    };

    if (initialProducts.length === 0) {
      loadProducts();
    } else {
      setIsLoading(false);
    }
  }, [user?.id, initialProducts]);

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const success = await deleteProduct(productId);
      
      if (success) {
        setProducts(prevProducts => 
          prevProducts.filter(product => product.id !== productId)
        );
      }
    }
  };

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    const success = await updateProduct(productId, { is_active: !currentStatus });
    
    if (success) {
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { ...product, is_active: !product.is_active } 
            : product
        )
      );
    }
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/weaverdb/products/#`);
    // router.push(`/weaverdb/products/edit/${productId}`);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const filteredProducts = products
    .filter(product => {
      if (categoryFilter !== 'all' && product.category !== categoryFilter) {
        return false;
      }
      
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) || 
          product.description.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'price-high') {
        return b.price - a.price;
      } else if (sortBy === 'price-low') {
        return a.price - b.price;
      } else if (sortBy === 'stock-high') {
        return b.stock_quantity - a.stock_quantity;
      } else if (sortBy === 'stock-low') {
        return a.stock_quantity - b.stock_quantity;
      }
      return 0;
    });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Products</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-auto focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          
          {/* Category filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md appearance-none bg-white w-full sm:w-auto focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Categories</option>
              <option value="sarees">Sarees</option>
              <option value="fabrics">Fabrics</option>
              <option value="clothing">Clothing</option>
              <option value="home-decor">Home Decor</option>
              <option value="accessories">Accessories</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Sort by */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-4 pr-8 py-2 border border-gray-300 rounded-md appearance-none bg-white w-full sm:w-auto focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="stock-high">Stock: High to Low</option>
              <option value="stock-low">Stock: Low to High</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">No products found</h3>
          <p className="text-sm text-gray-500">
            {searchQuery || categoryFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Add your first product to get started'}
          </p>
          <button
            onClick={() => router.push('/weaverdb/products/add')}
            className="mt-4 px-4 py-2 bg-amber-800 text-white rounded-md inline-flex items-center hover:bg-amber-700"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className={`border rounded-lg overflow-hidden transition-all hover:shadow-md ${!product.is_active ? 'opacity-70' : ''}`}
            >
              <div className="relative h-48 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                    <Package className="h-12 w-12" />
                  </div>
                )}
                
                {!product.is_active && (
                  <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-90">
                    Inactive
                  </div>
                )}
                
                {product.stock_quantity <= 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                    Out of Stock
                  </div>
                )}
                
                {product.stock_quantity > 0 && product.stock_quantity < 5 && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-md">
                    Low Stock
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-800 line-clamp-1">{product.name}</h3>
                  <span className="text-sm font-semibold text-amber-800">{formatPrice(product.price)}</span>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs text-gray-500">Added: {formatDate(product.created_at)}</div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium">Stock:</span>
                    <span className={`ml-1 text-xs font-medium ${
                      product.stock_quantity <= 0 
                        ? 'text-red-500' 
                        : product.stock_quantity < 5 
                          ? 'text-orange-500' 
                          : 'text-green-500'
                    }`}>
                      {product.stock_quantity}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => handleToggleActive(product.id, product.is_active)}
                    className={`px-2 py-1.5 text-xs rounded flex items-center justify-center flex-1 ${
                      product.is_active 
                        ? 'bg-amber-50 text-amber-800 hover:bg-amber-100' 
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {product.is_active ? 'Make Inactive' : 'Make Active'}
                  </button>
                  <button
                    onClick={() => handleEditProduct(product.id)}
                    className="px-2 py-1.5 bg-gray-100 text-gray-600 rounded text-xs flex items-center justify-center flex-1 hover:bg-gray-200"
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="px-2 py-1.5 bg-red-50 text-red-600 rounded text-xs flex items-center justify-center flex-1 hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;