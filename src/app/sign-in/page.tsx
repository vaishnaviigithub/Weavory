// pages/sign-in.tsx
"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient'; 

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const router = useRouter();

  // Modify the handleSignIn function in your sign-in.tsx:

  const handleSignIn = async () => {
    setSignInError('');
    try {
      console.log("Attempting to sign in with:", loginId);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginId,
        password,
      });
  
      if (error) {
        console.error('Supabase Sign-in Error:', error.message);
        setSignInError(error.message);
      } else {
        console.log('Sign-in successful:', data);
        
        // Store the session in localStorage to maintain login state
        localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        
        // Try to fetch user metadata
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error fetching user data:', userError);
        } else {
          console.log('User data:', userData);
          const userType = userData.user?.user_metadata?.userType || 'customer';
          console.log('User type:', userType);
          
          // Redirect based on user type
          if (userType === 'weaver') {
            console.log('Redirecting to weaverdb');
            router.push('/weaverdb');
          } else {
            console.log('Redirecting to home');
            router.push('/home');
          }
        }
      }
    } catch (err) {
      console.error('Unexpected error during sign-in:', err);
      setSignInError('Unexpected error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center px-4">
      
      <div className="absolute top-4 left-4">
        <button
          className="flex items-center text-gray-700 hover:text-amber-800 font-medium transition-colors"
          onClick={() => router.push('/')}
        >
          <ArrowRight className="rotate-180 mr-2 h-5 w-5" />
          Back to Home
        </button>
      </div>
      
      <div className="mb-8">
        <Image
          src="/images/icons/logo2.png"
          alt="Weavory Logo"
          width={180}
          height={180}
        />
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-8">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Welcome back!</h2>
        <p className="text-center text-gray-600 mb-8">Sign in to continue your journey with Weavory</p>

        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="loginId">
              Email
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              id="loginId"
              type="text"
              placeholder="Enter your email id"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {signInError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline">{signInError}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-amber-800 hover:text-amber-600">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              className="w-full bg-amber-800 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors flex items-center justify-center"
              type="button"
              onClick={handleSignIn}
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>

        {/* <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Image src="/images/icons/google.png" alt="Google" className="mr-2" width={18} height={18} />
              Google
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Image src="/images/icons/phone.png" alt="Phone" className="mr-2" width={18} height={18} />
              Phone
            </button>
          </div>
        </div> */}

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <a href="/register" className="text-amber-800 hover:text-amber-600 ml-1 font-medium">
            Register here
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;