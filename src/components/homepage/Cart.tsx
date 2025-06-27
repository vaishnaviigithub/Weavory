'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartProps {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  cartItems: CartItem[];
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  getTotalPrice: () => number;
}

const Cart: React.FC<CartProps> = ({ 
  cartOpen, 
  setCartOpen, 
  cartItems, 
  removeFromCart, 
  updateQuantity, 
  getTotalPrice 
}) => {
  const router = useRouter();

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
                </div>

                {cartItems.length > 0 && (
                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900 mb-1">
                      <p>Subtotal</p>
                      <p>₹{getTotalPrice().toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
                    <button
                      type="button"
                      onClick={() => router.push('/checkout')}
                      className="w-full bg-orange-600 border border-transparent rounded-md py-3 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-orange-700 focus:outline-none"
                    >
                      Checkout
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
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;