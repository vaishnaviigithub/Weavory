"use client";

import { supabase } from './supabaseClient';
import { Product, Order, WeaverProfile, DashboardStats } from './types';

// upload product images to Supabase Storage
export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadProductImage:', error);
    return null;
  }
};

// delete product images from Supabase Storage
export const deleteProductImage = async (imageUrl: string): Promise<boolean> => {
  try {
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(-2).join('/'); 

    const { error } = await supabase.storage
      .from('products')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteProductImage:', error);
    return false;
  }
};

export const getWeaverProfile = async (userId: string): Promise<WeaverProfile | null> => {
  const { data, error } = await supabase
    .from('weaver_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching weaver profile:', error);
    return null;
  }

  return data as WeaverProfile;
};

export const createOrUpdateWeaverProfile = async (profile: Partial<WeaverProfile>): Promise<WeaverProfile | null> => {
  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('weaver_profiles')
    .select('*')
    .eq('user_id', profile.user_id)
    .single();

  if (existingProfile) {
    // Update existing profile
    const { data, error } = await supabase
      .from('weaver_profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', profile.user_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating weaver profile:', error);
      return null;
    }

    return data as WeaverProfile;
  } else {
    // Create new profile
    const { data, error } = await supabase
      .from('weaver_profiles')
      .insert({
        ...profile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating weaver profile:', error);
      return null;
    }

    return data as WeaverProfile;
  }
};

export const getWeaverProducts = async (weaverId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('weaver_id', weaverId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching weaver products:', error);
    return [];
  }

  return data as Product[];
};

export const getProduct = async (productId: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data as Product;
};

export const createProduct = async (product: Partial<Product>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return null;
  }

  return data as Product;
};

export const updateProduct = async (productId: string, updates: Partial<Product>): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    return null;
  }

  return data as Product;
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  const { data: product } = await supabase
    .from('products')
    .select('images')
    .eq('id', productId)
    .single();

  if (product && product.images) {
    for (const imageUrl of product.images) {
      await deleteProductImage(imageUrl);
    }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }

  return true;
};

export const getWeaverOrders = async (weaverId: string): Promise<Order[]> => {
  const { data: orderItems, error: itemsError } = await supabase
    .from('uorder_items')
    .select('order_id')
    .eq('weaver_id', weaverId);

  if (itemsError) {
    console.error('Error fetching weaver order items:', itemsError);
    return [];
  }

  if (!orderItems || orderItems.length === 0) {
    return [];
  }

  const orderIds = [...new Set(orderItems.map(item => item.order_id))];

  const { data: orders, error: ordersError } = await supabase
    .from('uorders')
    .select(`
      *,
      uorder_items!inner (*)
    `)
    .in('id', orderIds)
    .order('order_date', { ascending: false });

  if (ordersError) {
    console.error('Error fetching weaver orders:', ordersError);
    return [];
  }

  return orders as unknown as Order[];
};

export const getOrdersByStatus = async (weaverId: string, status: string): Promise<Order[]> => {
  const { data: orderItems, error: itemsError } = await supabase
    .from('uorder_items')
    .select('order_id')
    .eq('weaver_id', weaverId);

  if (itemsError) {
    console.error('Error fetching weaver order items:', itemsError);
    return [];
  }

  if (!orderItems || orderItems.length === 0) {
    return [];
  }

  const orderIds = [...new Set(orderItems.map(item => item.order_id))];

  // filter by status
  const { data: orders, error: ordersError } = await supabase
    .from('uorders')
    .select(`
      *,
      uorder_items!inner (*)
    `)
    .in('id', orderIds)
    .eq('status', status)
    .order('order_date', { ascending: false });

  if (ordersError) {
    console.error('Error fetching orders by status:', ordersError);
    return [];
  }

  return orders as unknown as Order[];
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
  const { error } = await supabase
    .from('uorders')
    .update({
      status,
    })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }

  return true;
};

export const getWeaverDashboardStats = async (weaverId: string): Promise<DashboardStats> => {
  const { data: orderItems, error: itemsError } = await supabase
    .from('uorder_items')
    .select('order_id')
    .eq('weaver_id', weaverId);

  if (itemsError) {
    console.error('Error fetching weaver order items:', itemsError);
    return {
      total_earnings: 0,
      pending_orders: 0,
      processing_orders: 0,
      total_products: 0,
      low_stock_products: 0
    };
  }

  if (!orderItems || orderItems.length === 0) {
    // No orders
    const defaultStats = {
      total_earnings: 0,
      pending_orders: 0,
      processing_orders: 0,
      total_products: 0,
      low_stock_products: 0
    };

    const { count: productsCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('weaver_id', weaverId);

    if (!productsError && productsCount !== null) {
      defaultStats.total_products = productsCount;
    }

    // low stock products
    const { count: lowStockCount, error: lowStockError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('weaver_id', weaverId)
      .lt('stock_quantity', 5);

    if (!lowStockError && lowStockCount !== null) {
      defaultStats.low_stock_products = lowStockCount;
    }

    return defaultStats;
  }

  const orderIds = [...new Set(orderItems.map(item => item.order_id))];

  const { data: ordersData, error: ordersError } = await supabase
    .from('uorders')
    .select('id, total_amount, status')
    .in('id', orderIds);

  if (ordersError) {
    console.error('Error fetching orders for stats:', ordersError);
  }

  const { count: productsCount, error: productsError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('weaver_id', weaverId);

  if (productsError) {
    console.error('Error fetching products count:', productsError);
  }

  const { count: lowStockCount, error: lowStockError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('weaver_id', weaverId)
    .lt('stock_quantity', 5);

  if (lowStockError) {
    console.error('Error fetching low stock count:', lowStockError);
  }

  // stats
  const totalEarnings = ordersData
    ? ordersData.reduce((sum, order) => sum + Number(order.total_amount), 0)
    : 0;
  
  const pendingOrders = ordersData
    ? ordersData.filter(order => order.status === 'pending').length
    : 0;
  
  const processingOrders = ordersData
    ? ordersData.filter(order => order.status === 'processing').length
    : 0;

  return {
    total_earnings: totalEarnings,
    pending_orders: pendingOrders,
    processing_orders: processingOrders,
    total_products: productsCount || 0,
    low_stock_products: lowStockCount || 0
  };
};