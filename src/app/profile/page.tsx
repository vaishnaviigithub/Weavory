"use client";
import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, HelpCircle, Settings, LogOut, ChevronRight, MapPin, Map, Phone, Mail, Bell, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

interface Address {
  id: string;
  type: string;
  fullAddress: string;
  city: string;
  state: string;
  postalCode: string;
  default: boolean;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface ProfileProps {
  isOpen: boolean;
  toggleProfile: () => void;
}

const ProfileComponent: React.FC<ProfileProps> = ({ isOpen, toggleProfile }) => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notifications: true
  });
  const [loading, setLoading] = useState({
    profile: true,
    addresses: true,
    orders: true
  });
  const [editMode, setEditMode] = useState(false);
  const [tempInfo, setTempInfo] = useState({ ...personalInfo });
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    type: 'Home',
    fullAddress: '',
    city: '',
    state: '',
    postalCode: '',
    default: false
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(); // logout
      toggleProfile(); 
      window.location.href = '/sign-in'; 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      console.log('Fetching profile for user ID:', user.id);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('Fetch profile result:', { data, error });
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setPersonalInfo({
          name: data.full_name || data.name || '',
          email: user.email || '',
          phone: data.phone || '',
          notifications: true
        });
        setTempInfo({
          name: data.full_name || data.name || '',
          email: user.email || '',
          phone: data.phone || '',
          notifications: true,
          avatar_url: data.avatar_url || ''
        });
        console.log('Profile loaded successfully:', data);
      } else {
        console.log('No profile found for this user');
        setPersonalInfo({
          name: '',
          email: user.email || '',
          phone: '',
          notifications: true
        });
        setTempInfo({
          name: '',
          email: user.email || '',
          phone: '',
          notifications: true,
          avatar_url: ''
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    if (!user?.id || !isOpen) return;

    const fetchData = async () => {
      try {
        setLoading({ profile: true, addresses: true, orders: true });
        
        await fetchUserProfile();

        const { data: addressesData, error: addressError } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id);
          
        if (addressError) {
          console.error('Error fetching addresses:', addressError);
        } else {
          console.log('Addresses fetched:', addressesData);
          setAddresses(addressesData?.map(addr => ({
            id: addr.id,
            type: addr.type,
            fullAddress: addr.full_address,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postal_code,
            default: addr.is_default
          })) || []);
        }

        if (activeTab === 'orders') {
          const { data: ordersData, error: ordersError } = await supabase
          .from('uorders')
          .select(`
            id,
            order_date,
            total_amount,
            status,
            tracking_number,
            estimated_delivery,
            uorder_items (
              id,
              name,
              price,
              quantity,
              image_url
            )
          `)
          .eq('user_id', user.id);

            console.log('Orders Data:', ordersData);
            console.log('Orders Error:', ordersError);

          if (ordersError) {
            console.error('Error fetching orders:', ordersError);
          } else {
            console.log('Orders fetched:', ordersData);
            setOrders(
              ordersData?.map(order => ({
                id: order.id,
                date: order.order_date,
                total: order.total_amount,
                status: order.status,
                items: Array.isArray(order.uorder_items)
                  ? order.uorder_items.map(item => ({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: item.quantity,
                      image: item.image_url
                    }))
                  : [],
                trackingNumber: order.tracking_number,
                estimatedDelivery: order.estimated_delivery
              })) ?? []
            );
          }  
        }

        setLoading({ profile: false, addresses: false, orders: false });
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading({ profile: false, addresses: false, orders: false });
      }
    };

    fetchData();
  }, [user, isOpen, activeTab]);

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    console.log('handleUpdateProfile called');
    console.log('Current user:', user);
    if (!user) {
      console.error('No user found');
      return;
    }

    try {
      console.log('Checking for existing profile for user ID:', user.id);
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Existing profile check result:', { existingProfile, fetchError });

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching profile:', fetchError);
        throw fetchError;
      }

      const profileData = {
        name: tempInfo.name,
        phone: tempInfo.phone,
        avatar_url: tempInfo.avatar_url || null,
        updated_at: new Date().toISOString()
      };
      console.log('Profile data to save:', profileData);

      let result;
      
      if (!existingProfile) {
        console.log('No existing profile found, creating new profile');
        result = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            ...profileData,
            created_at: new Date().toISOString()
          });
      } else {
        console.log('Updating existing profile');
        result = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('id', user.id);
      }

      console.log('Save operation result:', result);

      if (result.error) {
        console.error('Error saving profile:', result.error);
        throw result.error;
      }

      setPersonalInfo({
        ...personalInfo,
        name: tempInfo.name,
        phone: tempInfo.phone
      });
      setEditMode(false);

      alert('Profile updated successfully!');
      
      fetchUserProfile();
    } catch (error) {
      console.error('Detailed error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleAddOrUpdateAddress = async () => {
    if (!user) return;
    
    try {
      if (editingAddress) {
        const { error } = await supabase
          .from('addresses')
          .update({
            type: editingAddress.type,
            full_address: editingAddress.fullAddress,
            city: editingAddress.city,
            state: editingAddress.state,
            postal_code: editingAddress.postalCode,
            is_default: editingAddress.default,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAddress.id);

        if (error) throw error;

        setAddresses(prev => 
          prev.map(addr => 
            addr.id === editingAddress.id ? editingAddress : addr
          )
        );
      } else {
        const { data, error } = await supabase
          .from('addresses')
          .insert({
            user_id: user.id,
            type: newAddress.type,
            full_address: newAddress.fullAddress,
            city: newAddress.city,
            state: newAddress.state,
            postal_code: newAddress.postalCode,
            is_default: newAddress.default
          })
          .select()
          .single();

        if (error) throw error;

        setAddresses(prev => [...prev, {
          ...newAddress,
          id: data.id
        }]);
      }

      setEditingAddress(null);
      setShowAddressForm(false);
      setNewAddress({
        type: 'Home',
        fullAddress: '',
        city: '',
        state: '',
        postalCode: '',
        default: false
      });
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) throw error;

      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          default: addr.id === addressId
        }))
      );
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      alert('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert('Failed to send password reset email');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'shipped': return <Package className="h-5 w-5 text-orange-500" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full z-40 transition-opacity backdrop-filter backdrop-blur-sm"
          onClick={toggleProfile}
        ></div>
        
        {/* Profile Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex z-50">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
              {/* Header */}
              <div className="bg-orange-500 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white">My Profile</h2>
                  <button
                    type="button"
                    className="rounded-md text-white hover:text-gray-200 focus:outline-none"
                    onClick={toggleProfile}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-orange-300 flex items-center justify-center text-white">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="ml-4 text-white">
                    <p className="text-lg font-semibold">{personalInfo.name}</p>
                    <p className="text-sm opacity-90">{personalInfo.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'personal' 
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Personal Details
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'orders' 
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab('help')}
                  className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'help' 
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Help & Support
                </button>
              </div>
              
              {/* Personal Details Tab */}
              {activeTab === 'personal' && (
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-8">
                    {/* Personal Information */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                        {editMode ? (
                          <div className="space-x-2">
                            <button
                              onClick={handleUpdateProfile}
                              className="text-sm font-medium text-orange-600 hover:text-orange-500"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditMode(false);
                                setTempInfo({ ...personalInfo });
                              }}
                              className="text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditMode(true)}
                            className="text-sm font-medium text-orange-600 hover:text-orange-500"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                      
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-4 py-5 sm:p-6 divide-y divide-gray-200">
                          <div className="flex justify-between py-3">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              Full Name
                            </dt>
                            <dd className="text-sm text-gray-900">
                              {editMode ? (
                                <input
                                  type="text"
                                  value={tempInfo.name}
                                  onChange={(e) => {
                                    setTempInfo({...tempInfo, name: e.target.value});
                                    console.log(tempInfo);
                                  }}
                                  className="border rounded px-2 py-1 w-full max-w-[200px]"
                                />
                              ) : (
                                personalInfo.name || 'Not provided'
                              )}
                            </dd>
                          </div>
                          <div className="flex justify-between py-3">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </dt>
                            <dd className="text-sm text-gray-900">{personalInfo.email}</dd>
                          </div>
                          <div className="flex justify-between py-3">
                            <dt className="text-sm font-medium text-gray-500 flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              Phone
                            </dt>
                            <dd className="text-sm text-gray-900">
                              {editMode ? (
                                <input
                                  type="text"
                                  value={tempInfo.phone}
                                  onChange={(e) => setTempInfo({...tempInfo, phone: e.target.value})}
                                  className="border rounded px-2 py-1 w-full max-w-[200px]"
                                />
                              ) : (
                                personalInfo.phone || 'Not provided'
                              )}
                            </dd>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Addresses */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">My Addresses</h3>
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none"
                          onClick={() => {
                            setEditingAddress(null);
                            setShowAddressForm(true);
                          }}
                        >
                          Add New
                        </button>
                      </div>
                      
                      {/* Address Form */}
                      {(showAddressForm || editingAddress) && (
                        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                          <h4 className="text-sm font-medium mb-3">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                              <select
                                value={editingAddress?.type || newAddress.type}
                                onChange={(e) => {
                                  if (editingAddress) {
                                    setEditingAddress({...editingAddress, type: e.target.value});
                                  } else {
                                    setNewAddress({...newAddress, type: e.target.value});
                                  }
                                }}
                                className="w-full border rounded px-3 py-2 text-sm"
                              >
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                              <input
                                type="text"
                                value={editingAddress?.fullAddress || newAddress.fullAddress}
                                onChange={(e) => {
                                  if (editingAddress) {
                                    setEditingAddress({...editingAddress, fullAddress: e.target.value});
                                  } else {
                                    setNewAddress({...newAddress, fullAddress: e.target.value});
                                  }
                                }}
                                className="w-full border rounded px-3 py-2 text-sm"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                  type="text"
                                  value={editingAddress?.city || newAddress.city}
                                  onChange={(e) => {
                                    if (editingAddress) {
                                      setEditingAddress({...editingAddress, city: e.target.value});
                                    } else {
                                      setNewAddress({...newAddress, city: e.target.value});
                                    }
                                  }}
                                  className="w-full border rounded px-3 py-2 text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input
                                  type="text"
                                  value={editingAddress?.state || newAddress.state}
                                  onChange={(e) => {
                                    if (editingAddress) {
                                      setEditingAddress({...editingAddress, state: e.target.value});
                                    } else {
                                      setNewAddress({...newAddress, state: e.target.value});
                                    }
                                  }}
                                  className="w-full border rounded px-3 py-2 text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                              <input
                                type="text"
                                value={editingAddress?.postalCode || newAddress.postalCode}
                                onChange={(e) => {
                                  if (editingAddress) {
                                    setEditingAddress({...editingAddress, postalCode: e.target.value});
                                  } else {
                                    setNewAddress({...newAddress, postalCode: e.target.value});
                                  }
                                }}
                                className="w-full border rounded px-3 py-2 text-sm"
                              />
                            </div>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={editingAddress?.default || newAddress.default}
                                onChange={(e) => {
                                  if (editingAddress) {
                                    setEditingAddress({...editingAddress, default: e.target.checked});
                                  } else {
                                    setNewAddress({...newAddress, default: e.target.checked});
                                  }
                                }}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                              />
                              <label className="ml-2 block text-sm text-gray-700">Set as default address</label>
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                              <button
                                onClick={() => {
                                  setEditingAddress(null);
                                  setShowAddressForm(false);
                                }}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleAddOrUpdateAddress}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700"
                              >
                                {editingAddress ? 'Update Address' : 'Save Address'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Address List */}
                      <div className="space-y-4">
                        {addresses.map((address) => (
                          <div 
                            key={address.id} 
                            className="bg-white rounded-lg border border-gray-200 p-4 relative"
                          >
                            {address.default && (
                              <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Default
                              </span>
                            )}
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div className="ml-3">
                                <h4 className="text-sm font-medium text-gray-900">{address.type}</h4>
                                <p className="mt-1 text-sm text-gray-500">{address.fullAddress}</p>
                                <p className="text-sm text-gray-500">
                                  {address.city}, {address.state} {address.postalCode}
                                </p>
                                <div className="mt-2 flex space-x-4">
                                  <button 
                                    className="text-xs text-orange-600 hover:text-orange-500"
                                    onClick={() => {
                                      setEditingAddress(address);
                                      setShowAddressForm(true);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  {!address.default && (
                                    <button 
                                      className="text-xs text-orange-600 hover:text-orange-500"
                                      onClick={() => handleSetDefaultAddress(address.id)}
                                    >
                                      Set as default
                                    </button>
                                  )}
                                  <button 
                                    className="text-xs text-red-600 hover:text-red-500"
                                    onClick={() => handleDeleteAddress(address.id)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Account Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <nav className="divide-y divide-gray-200">
                          <button 
                            onClick={handleChangePassword}
                            className="w-full flex items-center justify-between px-4 py-4 text-sm text-left text-gray-700 hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <Settings className="h-5 w-5 text-gray-400 mr-3" />
                              <span>Change Password</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </button>
                          
                            <button
  onClick={handleSignOut}
  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
>
  <LogOut className="h-4 w-4 mr-2" />
  Log Out
</button>
                         
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="flex-1 overflow-y-auto p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">My Orders</h3>
                  
                  {loading.orders ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                      <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Start exploring our handloom collection!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                              <p className="text-xs text-gray-500">Placed on {formatDate(order.date)}</p>
                            </div>
                            <div className="flex items-center">
                              {getStatusIcon(order.status)}
                              <span className="ml-2 text-sm font-medium capitalize">
                                {order.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flow-root">
                              <ul className="-mb-8">
                                {order.items.map((item) => (
                                  <li key={item.id} className="mb-4 last:mb-0">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-16 w-16 border border-gray-200 rounded-md overflow-hidden">
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="h-full w-full object-center object-cover"
                                        />
                                      </div>
                                      <div className="ml-4 flex-1">
                                        <div className="flex justify-between">
                                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                          <p className="text-sm text-gray-500">₹{item.price.toLocaleString()} × {item.quantity}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="mt-4 border-t border-gray-200 pt-4">
                              <div className="flex justify-between text-sm">
                                <p className="font-medium text-gray-900">Total</p>
                                <p className="font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            {order.trackingNumber && (
                              <div className="mt-4 bg-gray-50 p-3 rounded-md">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-xs text-gray-500">Tracking Number</p>
                                    <p className="text-sm font-medium">{order.trackingNumber}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-gray-500">Delivery</p>
                                    <p className="text-sm font-medium">
                                      {order.status === 'delivered' 
                                        ? `Delivered on ${formatDate(order.estimatedDelivery || '')}`
                                        : `Expected by ${formatDate(order.estimatedDelivery || '')}`
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Help & Support Tab */}
              {activeTab === 'help' && (
                <div className="flex-1 overflow-y-auto p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Help & Support</h3>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <HelpCircle className="h-5 w-5 text-orange-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-orange-800">Need more help?</h3>
                        <div className="mt-2 text-sm text-orange-700">
                          <p>Our customer support team is available Monday-Saturday, 9AM to 6PM.</p>
                          <p className="mt-1 font-medium">Email: support@weavory.com</p>
                          <p className="font-medium">Phone: +91 1800 123 4567</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">Frequently Asked Questions</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      <div className="px-4 py-4">
                        <h4 className="text-sm font-medium text-gray-900">How do I track my order?</h4>
                        <p className="mt-2 text-sm text-gray-500">You can track your order in the "My Orders" section of your profile. Click on any order to see detailed status information and tracking updates.</p>
                      </div>
                      <div className="px-4 py-4">
                        <h4 className="text-sm font-medium text-gray-900">What is your return policy?</h4>
                        <p className="mt-2 text-sm text-gray-500">We accept returns within 14 days of delivery. Items must be unused, unwashed, and in original packaging with all tags attached.</p>
                      </div>
                      <div className="px-4 py-4">
                        <h4 className="text-sm font-medium text-gray-900">How do I care for my handloom products?</h4>
                        <p className="mt-2 text-sm text-gray-500">Most handloom products should be dry cleaned or hand washed with mild detergent in cold water. Always follow the specific care instructions included with your purchase.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;