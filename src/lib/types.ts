export type Product = {
    id: string;
    weaver_id: string;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category: string;
    craft_type: string;
    materials: string[];
    images: string[];
    created_at: string;
    updated_at: string;
    is_active: boolean;
  };
  
  export type Order = {
    id: string;
    customer_id: string;
    weaver_id: string;
    order_items: OrderItem[];
    total_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
    shipping_address: Address;
    payment_status: 'pending' | 'paid' | 'failed';
    created_at: string;
    updated_at: string;
  };
  
  export type OrderItem = {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    product_image?: string;
  };
  
  export type Address = {
    full_name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone_number: string;
  };
  
  export type WeaverProfile = {
    id: string;
    user_id: string;
    shop_name: string;
    bio: string;
    location: string;
    craft_specialization: string;
    contact_phone: string;
    contact_email: string;
    is_verified: boolean;
    bank_account_info?: {
      account_name: string;
      account_number: string;
      bank_name: string;
      ifsc_code: string;
    };
    profile_image?: string;
    shop_banner?: string;
    created_at: string;
    updated_at: string;
  };
  
  export type DashboardStats = {
    total_earnings: number;
    pending_orders: number;
    processing_orders: number;
    total_products: number;
    low_stock_products: number;
  };