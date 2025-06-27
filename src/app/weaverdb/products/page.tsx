"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle } from 'lucide-react';
import ProductsList from '@/components/weaver/ProductsList';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Your Products</h1>
        <button
          onClick={() => router.push('/weaverdb/products/add')}
          className="flex items-center justify-center px-4 py-2 bg-amber-800 text-white rounded-md hover:bg-amber-700 transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Product
        </button>
      </div>
      
      <ProductsList />
    </div>
  );
}