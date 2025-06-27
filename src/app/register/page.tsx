// pages/register.tsx
"use client";

import React, { useState } from 'react';
import { ArrowRight, Scissors, ShoppingBag, Check } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient'; 

const Register = () => {
  const [userType, setUserType] = useState<'weaver' | 'customer' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [craft, setCraft] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [customCraft, setCustomCraft] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const router = useRouter();

  const handleRegistration = async () => {
    setRegistrationError('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            userType,
            ...(userType === 'weaver' && {
              location: location === 'other' ? customLocation : location,
              craft: craft === 'other' ? customCraft : craft,
            }),
          },
        },
      });

      if (error) {
        console.error('Registration error:', error.message);
        setRegistrationError(error.message);
      } else {
        console.log('User registered:', data);
        if (userType) localStorage.setItem('userType', userType);
        router.push('/registration-pending');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setRegistrationError('Unexpected error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-12">

      <div className="absolute top-4 left-4">
              <button
                className="flex items-center text-gray-700 hover:text-amber-800 font-medium transition-colors"
                onClick={() => router.push('/')}
              >
                <ArrowRight className="rotate-180 mr-2 h-5 w-5" />
                Back to Home
              </button>
            </div>

        <div className="flex justify-center mb-8">
          <Image
            src="/images/icons/logo2.png"
            alt="Weavory Logo"
            width={200}
            height={200}
          />
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-amber-800 text-white p-8">
              <h2 className="text-3xl font-bold mb-6">Join Weavory</h2>
              <p className="mb-4">Connect with India's rich weaving heritage through our platform.</p>

              <div className="space-y-4 mt-8">
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-4">
                    <Check className="h-5 w-5 text-orange-600" />
                  </div>
                  <p>Support authentic artisans</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-4">
                    <Check className="h-5 w-5 text-orange-600" />
                  </div>
                  <p>Explore virtual handloom fairs</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-4">
                    <Check className="h-5 w-5 text-orange-600" />
                  </div>
                  <p>Discover unique handcrafted products</p>
                </div>
              </div>
            </div>

            <div className="p-8 md:w-1/2">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Register as</h3>

              {!userType ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div
                    className="border-2 border-gray-200 hover:border-amber-500 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md"
                    onClick={() => setUserType('weaver')}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="bg-amber-100 rounded-full p-4">
                        <Scissors className="h-8 w-8 text-amber-800" />
                      </div>
                    </div>
                    <h4 className="text-xl font-medium text-center">Weaver</h4>
                    <p className="text-gray-600 text-center text-sm mt-2">Sell your handcrafted products</p>
                  </div>

                  <div
                    className="border-2 border-gray-200 hover:border-amber-500 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md"
                    onClick={() => setUserType('customer')}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="bg-amber-100 rounded-full p-4">
                        <ShoppingBag className="h-8 w-8 text-amber-800" />
                      </div>
                    </div>
                    <h4 className="text-xl font-medium text-center">Customer</h4>
                    <p className="text-gray-600 text-center text-sm mt-2">Discover authentic handloom products</p>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setUserType(null)}
                    className="text-orange-600 hover:text-orange-800 mb-6 flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
                    Back to selection
                  </button>

                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    {userType === 'weaver' ? 'Weaver Registration' : 'Customer Registration'}
                  </h3>

                  <form className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">Full Name</label>
                      <input
                        className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3"
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">Email</label>
                      <input
                        className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3"
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">Password</label>
                      <input
                        className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3"
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">Phone Number</label>
                      <input
                        className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3"
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    {userType === 'weaver' && (
                      <>
                        {/* <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="location">
                            Location/State
                          </label>
                          <select
                            className="shadow-sm border border-gray-300 rounded w-full py-2 px-3"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          >
                            <option value="">Select your state</option>
                            <option value="andhra-pradesh">Andhra Pradesh</option>
                            <option value="assam">Assam</option>
                            <option value="gujarat">Gujarat</option>
                            <option value="karnataka">Karnataka</option>
                            <option value="tamil-nadu">Tamil Nadu</option>
                            <option value="west-bengal">West Bengal</option>
                            <option value="other">Other</option>
                          </select>
                          {location === 'other' && (
                            <input
                              type="text"
                              placeholder="Enter your state"
                              className="mt-2 shadow-sm border border-gray-300 rounded w-full py-2 px-3"
                              value={customLocation}
                              onChange={(e) => setCustomLocation(e.target.value)}
                            />
                          )}
                        </div> */}

                        {/* <div>
                          <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="craft">
                            Craft Specialization
                          </label>
                          <select
                            className="shadow-sm border border-gray-300 rounded w-full py-2 px-3"
                            id="craft"
                            value={craft}
                            onChange={(e) => setCraft(e.target.value)}
                          >
                            <option value="">Select your craft</option>
                            <option value="silk">Silk Weaving</option>
                            <option value="cotton">Cotton Weaving</option>
                            <option value="wool">Wool Weaving</option>
                            <option value="ikat">Ikat</option>
                            <option value="block-printing">Block Printing</option>
                            <option value="other">Other</option>
                          </select>
                          {craft === 'other' && (
                            <input
                              type="text"
                              placeholder="Enter your craft"
                              className="mt-2 shadow-sm border border-gray-300 rounded w-full py-2 px-3"
                              value={customCraft}
                              onChange={(e) => setCustomCraft(e.target.value)}
                            />
                          )}
                        </div> */}
                      </>
                    )}

                    {registrationError && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline">{registrationError}</span>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        className="w-full bg-amber-800 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded"
                        type="button"
                        onClick={handleRegistration}
                        disabled={!userType}
                      >
                        Register
                      </button>
                    </div>

                    {userType === 'weaver' && (
                      <div className="mt-4 text-sm text-gray-600 bg-orange-50 p-4 rounded-lg">
                        <p className="font-medium mb-1">Need assistance?</p>
                        <p>Call our toll-free number: <span className="font-medium">1800-XXX-XXXX</span></p>
                        <p>Our team will help you set up your account and verify your craftsmanship.</p>
                      </div>
                    )}
                  </form>
                </>
              )}

              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?
                <a href="/sign-in" className="text-amber-800 hover:text-orange-800 ml-1 font-medium">
                  Login here
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
