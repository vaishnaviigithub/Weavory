"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient'; 
import Header from '../../components/homepage/header';
import VirtualFairs from '../../components/homepage/VirtualFairs';
import FeaturedProducts from '../../components/homepage/FeaturedProducts';
import Footer from '../../components/homepage/Footer';
import Cart from '../../components/homepage/Cart';

const CustomerHomepage = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    const initializeCart = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
  
        if (userError) {
          console.error('Error fetching user:', userError);
          return;
        }
  
        if (!user) {
          console.log('No user found. Redirecting to login...');
          window.location.href = '/login';
          return;
        }
  
        const userId = user.id;
  
        const { data: existingCart, error: cartError } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', userId)
          .single();
  
        if (cartError && cartError.code !== 'PGRST116') { 
          console.error('Error fetching cart:', cartError);
          return;
        }
  
        if (existingCart) {
          setCartId(existingCart.id);
          localStorage.setItem('cartId', existingCart.id);
          await loadCartItemsFromDatabase(existingCart.id);
        } else {
          const { data: newCart, error: createCartError } = await supabase
            .from('carts')
            .insert({ user_id: userId })
            .select();
  
          if (createCartError) {
            console.error('Error creating cart:', createCartError);
            return;
          }
  
          if (newCart && newCart.length > 0) {
            const newCartId = newCart[0].id;
            setCartId(newCartId);
            localStorage.setItem('cartId', newCartId);
          }
        }
      } catch (err) {
        console.error('Failed to initialize cart:', err);
      }
    };
  
    initializeCart();
  }, []);

  const loadCartItemsFromDatabase = async (cId) => {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        products:product_id (*)
      `)
      .eq('cart_id', cId);
      
    if (error) {
      console.error('Error loading cart items:', error);
      return;
    }
    
    if (data && data.length > 0) {
      const processedItems = data.map(item => {
        const product = item.products;
        const imageUrl = getImageUrl(product.images) || '/placeholder-product.jpg';

        return {
          ...product,
          quantity: item.quantity,
          image: imageUrl
        };
      });
      
      setCartItems(processedItems);
    }
  };

  const saveCartItemToDatabase = async (productId, quantity) => {
    if (!cartId) return;
    
    const { data, error } = await supabase
      .from('cart_items')
      .upsert({
        cart_id: cartId,
        product_id: productId,
        quantity: quantity
      }, {
        onConflict: 'cart_id,product_id'
      });
      
    if (error) {
      console.error('Error saving cart item:', error);
    }
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false }) 
          .limit(8);

        if (error) {
          console.error('Error fetching products:', error);
        } else {
          setFeaturedProducts(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

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

  const addToCart = (product) => {
    const imageUrl = getImageUrl(product.images) || '/placeholder-product.jpg';
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: newQuantity } : item
      ));
      
      saveCartItemToDatabase(product.id, newQuantity);
    } else {
      const newItem = { 
        ...product, 
        quantity: 1,
        image: imageUrl 
      };
      setCartItems([...cartItems, newItem]);
      
      saveCartItemToDatabase(product.id, 1);
    }

    setCartOpen(true);
  };

  const removeFromCart = async (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
    
    if (cartId) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId)
        .eq('product_id', productId);
        
      if (error) {
        console.error('Error removing cart item:', error);
      }
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
    
    if (cartId) {
      await saveCartItemToDatabase(productId, newQuantity);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0);
  };

  const upcomingFairs = [
    { id: 1, date: "March 22, 2025", title: "Spring Festival of Silks", location: "Virtual", image: "/images/looms/silk.jpg" },
    { id: 2, date: "April 15, 2025", title: "Cotton Weaves of India", location: "Virtual", image: "/images/looms/cotton.jpg" },
    { id: 3, date: "May 5, 2025", title: "Handloom Heritage Week", location: "Virtual", image: "/images/looms/heritage.webp" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={cartItems} setCartOpen={setCartOpen} />
      <main>
        <VirtualFairs upcomingFairs={upcomingFairs} />
        {loading ? (
          <div className="flex justify-center py-12">
            <p>Loading products...</p>
          </div>
        ) : (
          <FeaturedProducts featuredProducts={featuredProducts} addToCart={addToCart} />
        )}
      </main>
      <Cart 
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        getTotalPrice={getTotalPrice}
      />
      <Footer />
    </div>
  );
};

export default CustomerHomepage;