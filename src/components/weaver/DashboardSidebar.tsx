"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBasket,
  BarChart2, 
  Settings, 
  Circle,
  CalendarDays,
  HelpCircle
} from 'lucide-react';

const DashboardSidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/weaverdb',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'Products',
      href: '/weaverdb/products',
      icon: Package
    },
    {
      name: 'Orders',
      href: '/weaverdb/orders',
      icon: ShoppingBasket
    },
    
    {
      name: 'Profile',
      href: '/weaverdb/profile',
      icon: Settings
    }
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 py-6">
      <div className="flex flex-col flex-grow">
        <nav className="flex-1 px-4 space-y-1">
          {navigationItems.map((item) => {
            const isItemActive = item.exact 
              ? pathname === item.href 
              : isActive(item.href);
              
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                  ${isItemActive
                    ? 'bg-amber-50 text-amber-800'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-amber-600'}
                `}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isItemActive ? 'text-amber-800' : 'text-gray-500'}`} />
                {item.name}
                
                {/* Show dot notification for orders section */}
                {item.name === 'Orders' && (
                  <span className="ml-auto">
                    <Circle className="h-2 w-2 text-orange-500 fill-current" />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Help Section */}
      <div className="px-4 mt-6">
        <div className="p-4 bg-amber-50 rounded-lg">
          <div className="flex items-center mb-3">
            <HelpCircle className="h-5 w-5 text-amber-800 mr-2" />
            <h3 className="text-sm font-medium text-amber-800">Need Help?</h3>
          </div>
          <p className="text-xs text-amber-700 mb-3">
            Call our support line for assistance with your shop or products.
          </p>
          <div className="font-medium text-sm text-amber-800">
            1800-XXX-XXXX
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;