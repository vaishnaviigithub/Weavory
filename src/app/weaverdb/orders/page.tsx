"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import OrdersList from '@/components/weaver/OrdersList';

export default function OrdersPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h1>
      
      <OrdersList />
    </div>
  );
}