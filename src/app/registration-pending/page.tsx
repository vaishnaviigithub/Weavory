// pages/registration-pending.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';

const RegistrationPending = () => {
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
          <div className="bg-amber-100 rounded-full p-4">
            <Mail className="h-10 w-10 text-amber-800" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Verify Your Email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
        </p>
        
        <div className="p-4 bg-amber-50 rounded-lg mb-6">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> If you don't see the email, please check your spam folder.
          </p>
        </div>
        
        <Link href="/sign-in" className="inline-block w-full bg-amber-800 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
          Go to Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegistrationPending;