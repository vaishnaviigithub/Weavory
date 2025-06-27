"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/weaver/DashboardHeader';
import DashboardSidebar from '@/components/weaver/DashboardSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { AuthProvider } from '@/contexts/AuthContext';

export default function WeaverDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.userType !== 'weaver')) {
      router.push('/sign-in');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-amber-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 bg-amber-50"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.userType !== 'weaver') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}