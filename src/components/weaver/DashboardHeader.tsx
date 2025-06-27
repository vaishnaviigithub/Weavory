"use client";

import React, { useState } from 'react';
import { 
  Menu, 
  Settings, 
  ShoppingBag, 
  ChevronDown, 
  LogOut, 
  User,
  Bell
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader = () => {
  const { user, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-sm py-4 px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-gray-100 md:hidden mr-2"
            aria-label="Menu"
          >
            <Menu className="h-6 w-6 text-amber-800" />
          </button>
          
          <Link href="/weaverdb" className="flex items-center">
            <Image
              src="/images/icons/logo2.png"
              alt="Weavory"
              width={140}
              height={140}
              className="mr-2"
            />
          </Link>
        </div>

        {/* Right Side - Notifications & Profile */}
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100 relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-medium">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'W'}
              </div>
              <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                {user?.name || 'Weaver'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <Link href="/weaverdb/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Link>
                
                <Link href="/weaverdb/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  My Orders
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="mt-4 md:hidden">
          <ul className="space-y-2">
            <li>
              <Link href="/weaverdb" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/weaverdb/products" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                Products
              </Link>
            </li>
            <li>
              <Link href="/weaverdb/orders" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                Orders
              </Link>
            </li>
            <li>
              <Link href="/weaverdb/profile" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                Profile
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default DashboardHeader;