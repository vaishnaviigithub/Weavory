import React, { useState } from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weaver_id: string;
}

interface CartProps {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  cartItems: CartItem[];
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  getTotalPrice: () => number;
  clearCart: () => void;
}

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const Cart: React.FC<CartProps> = ({ 
  cartOpen, 
  setCartOpen, 
  cartItems, 
  removeFromCart, 
  updateQuantity, 
  getTotalPrice,
  clearCart
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      setCheckoutError(null);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setCheckoutError("You must be logged in to checkout. Please log in and try again.");
        setIsCheckingOut(false);
        return;
      }
      
      const { street, city, state, postalCode, country } = shippingAddress;
      if (!street || !city || !state || !postalCode || !country) {
        setCheckoutError("Please fill in all shipping address fields");
        setIsCheckingOut(false);
        return;
      }
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          weaver_id: determineMainWeaverId(), 
          total_amount: getTotalPrice(),
          status: 'pending',
          shipping_address: shippingAddress,
          payment_status: 'pending'
        })
        .select()
        .single();
      
      if (orderError || !orderData) {
        console.error("Order creation failed:", orderError);
        setCheckoutError("Failed to create your order. Please try again.");
        setIsCheckingOut(false);
        return;
      }
      
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        product_image: item.image
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        console.error("Order items creation failed:", itemsError);
        setCheckoutError("Failed to process your order items. Please try again.");
        setIsCheckingOut(false);
        return;
      }
      
      for (const item of cartItems) {
        const { error: stockError } = await supabase
          .from('products')
          .update({ 
            stock_quantity: supabase.rpc('decrement_stock', { 
              p_id: item.id, 
              qty: item.quantity 
            })
          })
          .eq('id', item.id);
        
        if (stockError) {
          console.error("Stock update failed:", stockError);
        }
      }
      
      setCheckoutSuccess(true);
      clearCart();
      setTimeout(() => {
        setCartOpen(false);
        setCheckoutSuccess(false);
        router.push(`/orders/${orderData.id}`);
      }, 3000);
      
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError("An unexpected error occurred. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const determineMainWeaverId = (): string => {
    if (cartItems.length > 0 && cartItems[0].weaver_id) {
      return cartItems[0].weaver_id;
    }
    throw new Error("Cannot determine weaver for this order");
  };

  return (
    <>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-opacity-50 overflow-y-auto h-full w-full z-40 transition-opacity backdrop-filter backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          
          {/* Side Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex z-50">
            <div className="w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex-1 flex flex-col overflow-y-auto">
                  <div className="py-6 px-4 bg-orange-600 sm:px-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-white">Your Cart</h2>
                      <button
                        type="button"
                        className="rounded-md bg-orange-600 text-white hover:text-gray-200 focus:outline-none"
                        onClick={() => setCartOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-orange-100">
                      {cartItems.length === 0 
                        ? "Your cart is empty"
                        : `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`
                      }
                    </p>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="flex-1 flex flex-col justify-center items-center p-6">
                    <ShoppingBag className="h-16 w-16 text-gray-300" />
                    <p className="mt-4 text-gray-500 text-lg">Your cart is empty</p>
                    <button
                      type="button"
                      className="mt-6 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700"
                      onClick={() => setCartOpen(false)}
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 px-4 py-6 sm:px-6">
                    <div className="flow-root">
                      <ul className="-my-6 divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <li key={item.id} className="py-6 flex">
                            <div className="flex-shrink-0 h-24 w-24 border border-gray-200 rounded-md overflow-hidden">
                              <Image
                                src={item.image || '/placeholder-product.jpg'}
                                alt={item.name}
                                width={96}
                                height={96}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center border rounded-md">
                                  <button
                                    type="button"
                                    className="p-1 text-gray-600 hover:text-gray-800"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="px-2 py-1 text-gray-900">{item.quantity}</span>
                                  <button
                                    type="button"
                                    className="p-1 text-gray-600 hover:text-gray-800"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="flex">
                                  <button
                                    type="button"
                                    className="font-medium text-orange-600 hover:text-orange-800 flex items-center"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Shipping Address Form (only shown during checkout) */}
                {cartItems.length > 0 && checkoutSuccess === false && (
                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                      <p>Shipping Address</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
                        <input
                          type="text"
                          name="street"
                          id="street"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                          value={shippingAddress.street}
                          onChange={handleAddressChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                          <input
                            type="text"
                            name="city"
                            id="city"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            value={shippingAddress.city}
                            onChange={handleAddressChange}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                          <input
                            type="text"
                            name="state"
                            id="state"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            value={shippingAddress.state}
                            onChange={handleAddressChange}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                          <input
                            type="text"
                            name="postalCode"
                            id="postalCode"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            value={shippingAddress.postalCode}
                            onChange={handleAddressChange}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                          <input
                            type="text"
                            name="country"
                            id="country"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm bg-gray-100"
                            value={shippingAddress.country}
                            onChange={handleAddressChange}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {cartItems.length > 0 && checkoutSuccess === false && (
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900 mb-1">
                    <p>Subtotal</p>
                    <p>₹{getTotalPrice().toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
                  
                  {checkoutError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{checkoutError}</p>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    className="w-full bg-orange-600 border border-transparent rounded-md py-3 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-orange-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? 'Processing...' : 'Checkout'}
                  </button>
                  <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        className="text-orange-600 font-medium hover:text-orange-800"
                        onClick={() => setCartOpen(false)}
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}
              
              {checkoutSuccess && (
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6 flex flex-col items-center justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Order Placed Successfully!</h3>
                  <p className="mt-1 text-sm text-gray-500 text-center">
                    Thank you for your order. We are processing it now and will notify you once it's on the way.
                  </p>
                  <p className="mt-4 text-sm text-gray-500">Redirecting to your order details...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    )}
  </>
);
};

export default Cart;