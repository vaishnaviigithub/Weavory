"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Save, Loader2, Building, Mail, Phone, MapPin, Scissors } from 'lucide-react';
import { getWeaverProfile, createOrUpdateWeaverProfile } from '@/lib/weaverService';
import { WeaverProfile } from '@/lib/types';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [customCraft, setCustomCraft] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [profile, setProfile] = useState<Partial<WeaverProfile>>({
    user_id: '',
    shop_name: '',
    bio: '',
    location: '',
    craft_specialization: '',
    contact_phone: '',
    contact_email: '',
    profile_image: '',
    shop_banner: '',
    bank_account_info: {
      account_name: '',
      account_number: '',
      bank_name: '',
      ifsc_code: ''
    }
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        try {
          const fetchedProfile = await getWeaverProfile(user.id);
          
          if (fetchedProfile) {
            setProfile(fetchedProfile);
          } else {
            // default values for non existent user
            setProfile({
              user_id: user.id,
              shop_name: user.name ? `${user.name}'s Shop` : 'My Handloom Shop',
              contact_email: user.email || '',
              location: '',
              craft_specialization: '',
              contact_phone: '',
              bio: '',
              bank_account_info: {
                account_name: '',
                account_number: '',
                bank_name: '',
                ifsc_code: ''
              }
            });
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading profile:', error);
          setIsLoading(false);
        }
      }
    };
    
    loadProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'craft_specialization' && value !== 'other') {
      setCustomCraft('');
    }
  
    if (name === 'location' && value !== 'other') {
      setCustomLocation('');
    }
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleBankInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      bank_account_info: {
        ...prev.bank_account_info,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setIsSaving(true);
    
    try {
      if (!user?.id) {
        throw new Error('User ID not found');
      }
      
      const updatedProfile = await createOrUpdateWeaverProfile({
        ...profile,
        user_id: user.id,
        craft_specialization: profile.craft_specialization === 'other' ? customCraft : profile.craft_specialization,
        location: profile.location === 'other' ? customLocation : profile.location,
      });
      
      if (updatedProfile) {
        setSuccessMessage('Profile updated successfully!');
        setProfile(updatedProfile);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('An error occurred while saving your profile. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Banner and Profile Image */}
        <div className="relative h-48 bg-amber-50">
          {profile.shop_banner ? (
            <img 
              src={profile.shop_banner} 
              alt="Shop Banner" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-amber-300">
              <p className="text-center text-sm text-amber-800">
                Add a shop banner to customize your shop
              </p>
            </div>
          )}
          
          <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md">
            <Camera className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-amber-100 flex items-center justify-center overflow-hidden">
                {profile.profile_image ? (
                  <img 
                    src={profile.profile_image} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-semibold text-amber-800">
                    {profile.shop_name ? profile.shop_name.charAt(0).toUpperCase() : 'W'}
                  </span>
                )}
              </div>
              
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-20 px-6 pb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-amber-800" />
                  Shop Information
                </h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Name
                </label>
                <input
                  type="text"
                  name="shop_name"
                  value={profile.shop_name || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Your shop name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Craft Specialization
                </label>
                <select
                  name="craft_specialization"
                  value={profile.craft_specialization || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white"
                  required
                >
                  <option value="">Select your craft</option>
                  <option value="silk">Silk Weaving</option>
                  <option value="cotton">Cotton Weaving</option>
                  <option value="wool">Wool Weaving</option>
                  <option value="ikat">Ikat</option>
                  <option value="block-printing">Block Printing</option>
                  <option value="other">Other</option>
                </select>

                {profile.craft_specialization === 'other' && (
                <input
                  type="text"
                  placeholder="Enter your craft"
                  className="mt-2 shadow-sm border border-gray-300 rounded w-full py-2 px-3"
                  value={customCraft}
                  onChange={(e) => setCustomCraft(e.target.value)}
                />
              )}
                
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shop Description / Bio
                </label>
                <textarea
                  name="bio"
                  value={profile.bio || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Tell customers about your shop, your craftsmanship, and your story..."
                />
              </div>
              
              {/* Contact Information */}
              <div className="md:col-span-2 pt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-amber-800" />
                  Contact Information
                </h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={profile.contact_email || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={profile.contact_phone || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Your contact number"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  name="location"
                  value={profile.location || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white"
                  required
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
                {profile.location === 'other' && (
                <input
                  type="text"
                  placeholder="Enter your state"
                  className="mt-2 shadow-sm border border-gray-300 rounded w-full py-2 px-3"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                />
              )}
              </div>
              
              <div className="md:col-span-2">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex items-start mb-2">
                    <Scissors className="h-5 w-5 text-amber-800 mr-2 mt-0.5" />
                    <h3 className="text-amber-800 font-medium">Verification Status</h3>
                  </div>
                  
                  <p className="text-sm text-amber-700 ml-7">
                    {profile.is_verified 
                      ? 'Your weaver account has been verified. You can now sell products on Weavory.' 
                      : 'Your account is pending verification. Our team will contact you soon to verify your craftsmanship.'}
                  </p>
                </div>
              </div>
              
              {/* Bank Account Information */}
              <div className="md:col-span-2 pt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-amber-800" />
                  Bank Account Information
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Your bank account details are required for receiving payments from your sales.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="account_name"
                  value={profile.bank_account_info?.account_name || ''}
                  onChange={handleBankInfoChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Name on your bank account"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="account_number"
                  value={profile.bank_account_info?.account_number || ''}
                  onChange={handleBankInfoChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Your bank account number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bank_name"
                  value={profile.bank_account_info?.bank_name || ''}
                  onChange={handleBankInfoChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Your bank name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifsc_code"
                  value={profile.bank_account_info?.ifsc_code || ''}
                  onChange={handleBankInfoChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  placeholder="IFSC code of your bank branch"
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-amber-800 text-white rounded-md hover:bg-amber-700 flex items-center transition-colors"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}