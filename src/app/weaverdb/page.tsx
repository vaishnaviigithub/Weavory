"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  TruckIcon, 
  CreditCard, 
  AlertCircle, 
  Boxes, 
  BarChart,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StatsCard from '@/components/weaver/StatsCard';
import QuickAddProduct from '@/components/weaver/QuickAddProduct';
import ProductsList from '@/components/weaver/ProductsList';
import OrdersList from '@/components/weaver/OrdersList';
import { getWeaverDashboardStats, getOrdersByStatus, getWeaverProducts } from '@/lib/weaverService';
import { DashboardStats, Order, Product } from '@/lib/types';

export default function WeaverDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user?.id) {
        try {
          // stats
          const dashboardStats = await getWeaverDashboardStats(user.id);
          setStats(dashboardStats);
          
          // pending orders
          const pendingOrdersData = await getOrdersByStatus(user.id, 'processing');
          setPendingOrders(pendingOrdersData);
          
          // recent products (latest 3)
          const productsData = await getWeaverProducts(user.id);
          setRecentProducts(productsData.slice(0, 3));
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading dashboard data:', error);
          setIsLoading(false);
        }
      }
    };
    
    loadDashboardData();
  }, [user?.id]);

  const handleViewOrders = (status?: string) => {
    if (status) {
      router.push(`/weaverdb/orders?status=${status}`);
    } else {
      router.push('/weaverdb/orders');
    }
  };

  const handleViewProducts = () => {
    router.push('/weaverdb/products');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Dashboard Header Section */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-amber-900 mb-1">Welcome, {user?.name || 'Weaver'}</h1>
            <p className="text-amber-700">Manage your products and orders from one place</p>
          </div>
          <button 
            onClick={() => router.push('/weaverdb/products/add')}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-sm"
          >
            <PlusCircle size={18} />
            Add New Product
          </button>
        </div>
      </div>
      
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Earnings"
          value={`₹${stats?.total_earnings.toFixed(2) || '0.00'}`}
          icon={CreditCard}
          description="All time earnings"
          bgColor="bg-white"
          trend="+12% from last month"
          trendUp={true}
        />
        
        <StatsCard
          title="Pending Orders"
          value={(stats?.pending_orders || 0) + (stats?.processing_orders || 0)}
          icon={Package}
          isButton={true}
          onClick={() => handleViewOrders('pending')}
          bgColor="bg-white"
          description="Need your attention"
        />
        
        <StatsCard
          title="Low Stock Items"
          value={stats?.low_stock_products || 0}
          icon={AlertCircle}
          description={`Out of ${stats?.total_products || 0} products`}
          bgColor={stats?.low_stock_products ? 'bg-orange-50' : 'bg-white'}
          iconColor={stats?.low_stock_products ? 'text-orange-500' : 'text-amber-800'}
        />

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Quick Actions</h3>
              <div className="space-y-2 mt-3">
                <button 
                  onClick={() => router.push('/weaverdb/products/add')}
                  className="flex items-center text-sm text-amber-800 hover:text-amber-600 transition-colors"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Add Product
                </button>
                <button 
                  onClick={() => handleViewOrders('pending')}
                  className="flex items-center text-sm text-amber-800 hover:text-amber-600 transition-colors"
                >
                  <Package size={16} className="mr-2" />
                  Process Orders
                </button>
                <button 
                  className="flex items-center text-sm text-amber-800 hover:text-amber-600 transition-colors"
                >
                  <TrendingUp size={16} className="mr-2" />
                  View Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Orders and Products Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pending Orders Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Clock size={18} className="text-amber-800" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Pending Orders</h2>
            </div>
            <button
              onClick={() => handleViewOrders()}
              className="flex items-center gap-1 text-sm text-amber-800 hover:text-amber-600 font-medium"
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>
  
          {pendingOrders.length === 0 ? (
            <div className="text-center py-10 px-4 border-b border-gray-100">
              <div className="bg-amber-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
                <Package className="h-8 w-8 text-amber-300" />
              </div>
              <h3 className="text-base font-medium text-gray-600 mb-1">No pending orders</h3>
              <p className="text-sm text-gray-500">All caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-medium text-gray-800">Order #{order.id.slice(0, 8)}</h3>
                    <span className="text-sm font-semibold text-amber-800">
                      ₹{order.total_amount ? order.total_amount.toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(order.order_date || Date.now()).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-600">
                      {order.uorder_items ? order.uorder_items.length : 0} {!order.uorder_items || order.uorder_items.length === 1 ? 'item' : 'items'}
                    </div>
                    <button
                      onClick={() => router.push(`/weaverdb/orders/${order.id}`)}
                      className="text-xs bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full hover:bg-amber-200 transition-colors"
                    >
                      Process Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {pendingOrders.length > 0 && (
            <div className="bg-amber-50 p-3 text-xs text-amber-800 text-center">
              You have {pendingOrders.length} order{pendingOrders.length === 1 ? '' : 's'} to process
            </div>
          )}
        </div>
        
        {/* Recent Products Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 p-2 rounded-lg">
                <Boxes size={18} className="text-amber-800" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Recent Products</h2>
            </div>
            <button
              onClick={handleViewProducts}
              className="flex items-center gap-1 text-sm text-amber-800 hover:text-amber-600 font-medium"
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          
          {recentProducts.length === 0 ? (
            <div className="text-center py-10 px-4 border-b border-gray-100">
              <div className="bg-amber-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
                <Boxes className="h-8 w-8 text-amber-300" />
              </div>
              <h3 className="text-base font-medium text-gray-600 mb-1">No products added yet</h3>
              <p className="text-sm text-gray-500">Add your first product to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentProducts.map((product) => (
                <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                          <Package className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                        <span className="text-sm font-semibold text-amber-800">₹{product.price.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1 mb-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                            product.stock_quantity <= 0 
                              ? 'bg-red-500' 
                              : product.stock_quantity < 5 
                                ? 'bg-orange-500' 
                                : 'bg-green-500'
                          }`}></span>
                          <span className={`text-xs font-medium ${
                            product.stock_quantity <= 0 
                              ? 'text-red-500' 
                              : product.stock_quantity < 5 
                                ? 'text-orange-500' 
                                : 'text-green-500'
                          }`}>
                            Stock: {product.stock_quantity}
                          </span>
                        </div>
                        <button
                          onClick={() => router.push(`/weaverdb/products/edit/${product.id}`)}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {recentProducts.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => router.push('/weaverdb/products/add')}
                className="w-full flex items-center justify-center gap-2 text-sm text-amber-800 hover:text-amber-900 font-medium py-2"
              >
                <PlusCircle size={16} />
                Add New Product
              </button>
            </div>
          )}
        </div>
      </div>
      
      
    </div>
  );
}