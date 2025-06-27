"use client";
import React, { useState } from 'react';
import { Search, ShoppingBag, User, Home, Map, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import ProfileComponent from '../../app/profile/page';

const Header = ({ cartItems, setCartOpen }) => {
  const { user, isLoading } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Image 
                  src="/images/icons/logo.jpg" 
                  alt="Weavory Logo"
                  width={130}
                  height={130}
                />
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, weavers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
                />
                <Search className="h-4 w-4 text-gray-500 absolute left-3 top-2.5" />
              </div>
            </div>
            
            <nav className="flex space-x-8">
              <Link href="/home" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                <Home className="h-5 w-5 mr-1" />
                Home
              </Link>
              <Link href="/products" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                <Map className="h-5 w-5 mr-1" />
                Explore
              </Link>
              <Link href="/wishlist" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                <Heart className="h-5 w-5 mr-1" />
                Wishlist
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCartOpen(true)}
                className="text-gray-500 hover:text-gray-900 relative"
              >
                <ShoppingBag className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
              
              {isLoading ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : user ? (
                <button 
                  onClick={() => setProfileOpen(true)}
                  className="flex items-center space-x-1 cursor-pointer"
                >
                  {user.name ? (
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <User className="h-6 w-6 text-gray-500" />
                  )}
                </button>
              ) : (
                <Link href="/sign-in" className="text-gray-500 hover:text-gray-900">
                  <User className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sidebar */}
      <ProfileComponent isOpen={profileOpen} toggleProfile={() => setProfileOpen(false)} />
    </header>
  );
};

export default Header;