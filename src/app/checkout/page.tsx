'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { CheckCircle, AlertCircle, ArrowLeft, CreditCard, Truck } from 'lucide-react';
import Image from 'next/image';

export default function Checkout() {
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true); 
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const [newAddress, setNewAddress] = useState({
    fullAddress: '',
    city: '',
    state: '',
    postalCode: '',
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [formErrors, setFormErrors] = useState({});
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (!user) {
          router.push('/login');
          return;
        }
        
        const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
        if (cartError && cartError.code !== 'PGRST116') { 
          throw cartError;
        }
        
        if (!cartData) {
          setCartItems([]);
          setTotalAmount(0);
          setLoading(false);
          return;
        }
        
        const { data: items, error: itemsError } = await supabase
          .from('cart_items')
          .select(`
            id,
            quantity,
            products:product_id(
              id,
              name,
              price,
              images,
              stock_quantity,
              weaver_id
            )
          `)
          .eq('cart_id', cartData.id);
        
        if (itemsError) throw itemsError;
        
        const formattedItems = items.map(item => ({
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          image: Array.isArray(item.products.images) ? item.products.images[0] : null, 
          quantity: item.quantity,
          stockQuantity: item.products.stock_quantity,
          weaverId: item.products.weaver_id
        }));
        
        setCartItems(formattedItems);
        
        // total amt
        const total = formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalAmount(total);
        
        await fetchUserAddresses(user.id);
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setError('Failed to load your cart. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);
  
  const fetchUserAddresses = async (userId) => {
    try {
      const { data: addressData, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });
      
      if (error) throw error;
      
      setAddresses(addressData);
      
      const defaultAddress = addressData.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else if (addressData.length > 0) {
        setSelectedAddress(addressData[0].id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };
  
  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19); 
      
      setPaymentInfo(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    if (name === 'expiryDate') {
      const cleanValue = value.replace(/\D/g, '');
      let formattedValue = cleanValue;
      
      if (cleanValue.length > 2) {
        formattedValue = `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
      }
      
      setPaymentInfo(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    if (name === 'cvv') {
      const cleanValue = value.replace(/\D/g, '').slice(0, 4);
      setPaymentInfo(prev => ({
        ...prev,
        [name]: cleanValue
      }));
      return;
    }
    
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!selectedAddress && !newAddress.fullAddress) {
      errors.address = 'Please select or add a shipping address';
    }
    
    if (paymentMethod === 'card') {
      if (!paymentInfo.cardNumber || paymentInfo.cardNumber.replace(/\s/g, '').length < 16) {
        errors.cardNumber = 'Please enter a valid card number';
      }
      
      if (!paymentInfo.cardHolder) {
        errors.cardHolder = 'Please enter the cardholder name';
      }
      
      if (!paymentInfo.expiryDate || paymentInfo.expiryDate.length < 5) {
        errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      
      if (!paymentInfo.cvv || paymentInfo.cvv.length < 3) {
        errors.cvv = 'Please enter a valid CVV code';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleAddNewAddress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          type: 'shipping',
          full_address: newAddress.fullAddress,
          city: newAddress.city,
          state: newAddress.state,
          postal_code: newAddress.postalCode,
          is_default: addresses.length === 0 
        })
        .select();
      
      if (error) throw error;
      
      setAddresses([...addresses, data[0]]);
      setSelectedAddress(data[0].id);
      
      setNewAddress({
        fullAddress: '',
        city: '',
        state: '',
        postalCode: '',
      });
      
    } catch (error) {
      console.error('Error adding address:', error);
      setError('Failed to add new address. Please try again.');
    }
  };
  
  const processPayment = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isSuccessful = true;
        resolve({ success: isSuccessful, transactionId: `TXN-${Date.now()}` });
      }, 1500);
    });
  };
  
  const placeOrder = async () => {
    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }
      
      const addressToUse = addresses.find(addr => addr.id === selectedAddress);
      
      if (!addressToUse) {
        throw new Error('Please select a valid shipping address');
      }
      
      const paymentResult = await processPayment();
      
      if (!paymentResult.success) {
        throw new Error('Payment processing failed. Please try again.');
      }
      
      const { data: orderData, error: orderError } = await supabase
        .from('uorders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: 'processing',
          tracking_number: `TR-${Math.floor(Math.random() * 1000000)}`,
          estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() 
        })
        .select();
      
        if (orderError || !orderData || orderData.length === 0) {
            throw new Error('Failed to create order. Please try again.');
          }
      
      const orderItems = cartItems.map(item => ({
        order_id: orderData[0].id,
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image,
        weaver_id: item.weaverId
      }));
      
      const { error: itemsError } = await supabase
        .from('uorder_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      for (const item of cartItems) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            stock_quantity: supabase.rpc('decrement_stock', { 
              p_id: item.id, 
              quantity: item.quantity 
            })
          })
          .eq('id', item.id);
        
        if (updateError) console.error('Error updating stock:', updateError);
      }
      
      const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('session_id', user.id)
        .eq('status', 'active')
        .single();
      
      if (!cartError && cartData) {
        const { error: updateCartError } = await supabase
          .from('carts')
          .update({ status: 'completed' })
          .eq('id', cartData.id);
        
        if (updateCartError) console.error('Error updating cart status:', updateCartError);
      }
      
      setOrderPlaced(true);
      
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message || 'Failed to place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto p-6 my-10">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase. We'll send you a confirmation email shortly.</p>
          
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-medium mb-2">Order Summary</h2>
            <p className="text-gray-600">Total Items: {cartItems.length}</p>
            <p className="text-gray-600">Total Amount: ₹{totalAmount.toLocaleString()}</p>
          </div>
          
          <button
            onClick={() => router.push('/home')}
            className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (loading && !orderPlaced) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6 h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <button 
          onClick={() => router.push('/home')} 
          className="flex items-center text-orange-600 mb-6 hover:text-orange-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Shop
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <button
            onClick={() => router.push('/home')}
            className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-orange-600 mb-6 hover:text-orange-800"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Cart
      </button>
      
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-orange-600" />
              Shipping Address
            </h2>
            
            {addresses.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select from your addresses:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div 
                      key={address.id}
                      className={`border rounded-md p-3 cursor-pointer transition-colors ${
                        selectedAddress === address.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                      }`}
                      onClick={() => setSelectedAddress(address.id)}
                    >
                      <div className="flex justify-between">
                        <p className="font-medium">{address.type || 'Address'}</p>
                        {address.is_default && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{address.full_address}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Or add a new address:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                  <input
                    type="text"
                    name="fullAddress"
                    value={newAddress.fullAddress}
                    onChange={handleNewAddressChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Street address, apartment, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={newAddress.postalCode}
                    onChange={handleNewAddressChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddNewAddress}
                className="mt-4 px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700"
                disabled={!newAddress.fullAddress || !newAddress.city || !newAddress.state || !newAddress.postalCode}
              >
                Add Address
              </button>
              {formErrors.address && (
                <p className="mt-2 text-sm text-red-600">{formErrors.address}</p>
              )}
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-orange-600" />
              Payment Method
            </h2>
            
            <div className="mb-4">
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="h-4 w-4 text-orange-600"
                  />
                  <span className="ml-2">Credit/Debit Card</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="h-4 w-4 text-orange-600"
                  />
                  <span className="ml-2">Cash on Delivery</span>
                </label>
              </div>
            </div>
            
            {paymentMethod === 'card' && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentInfoChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="1234 5678 9012 3456"
                  />
                  {formErrors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={paymentInfo.cardHolder}
                    onChange={handlePaymentInfoChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="John Doe"
                  />
                  {formErrors.cardHolder && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.cardHolder}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentInfoChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="MM/YY"
                    />
                    {formErrors.expiryDate && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.expiryDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentInfoChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="123"
                    />
                    {formErrors.cvv && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === 'cod' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  You will pay when your order is delivered. Please ensure you have the exact amount available.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="max-h-64 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex py-3 border-b">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-gray-900">
                        <h3 className="line-clamp-1">{item.name}</h3>
                        <p className="ml-4">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {item.quantity}</p>
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 pb-2">
              <div className="flex justify-between text-sm mb-2">
                <p>Subtotal</p>
                <p>₹{totalAmount.toLocaleString()}</p>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <p>Tax</p>
                <p>Included</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Total</p>
                <p>₹{totalAmount.toLocaleString()}</p>
              </div>
              
              <button
                type="button"
                onClick={placeOrder}
                disabled={loading || cartItems.length === 0}
                className="w-full bg-orange-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-orange-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
              
              <div className="mt-6">
                <p className="text-xs text-gray-500 text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}