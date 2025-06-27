// pages/registration-success.tsx
"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const RegistrationSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and redirect based on user type
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        // Get user metadata to determine type
        const { data: userData } = await supabase.auth.getUser();
        const userType = userData.user?.user_metadata?.userType || localStorage.getItem('userType');
        
        // Redirect based on user type
        if (userType === 'weaver') {
          router.push('/weaverdb');
        } else {
          router.push('/home');
        }
      } else {
        // If no session, redirect to sign-in
        router.push('/sign-in');
      }
    };

    // Set a timeout to allow the success page to be shown briefly
    const timer = setTimeout(() => {
      checkAuth();
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Image
          src="/images/icons/logo2.png"
          alt="Weavory Logo"
          width={150}
          height={150}
        />
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Registration Successful!</h2>
        <p className="text-gray-600 mb-6">
          Your account has been created successfully. You'll be redirected to your dashboard momentarily.
        </p>
        
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800"></div>
          <span className="ml-3 text-amber-800">Redirecting...</span>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;