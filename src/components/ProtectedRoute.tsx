"use client";

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedUserTypes?: ('weaver' | 'customer')[];
};

const ProtectedRoute = ({ 
  children, 
  allowedUserTypes 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        window.location.href = '/sign-in';
        return;
      } else if (allowedUserTypes && !allowedUserTypes.includes(user.userType as any)) {
        window.location.href = user.userType === 'weaver' ? '/weaverdb' : '/home';
        return;
      }
    }
  }, [user, isLoading, allowedUserTypes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(user.userType as any)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;