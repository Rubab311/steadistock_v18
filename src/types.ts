export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description?: string;
  branchId: string; // Branch specific inventory
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
}

export interface Sale {
  id: string;
  timestamp: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'Cash on Delivery' | 'Card';
  customerName?: string;
  customerId?: string;
  branchId: string; // Branch specific sales
  cardDetails?: {
    lastFour: string;
    cardType: string;
  };
}

export type TimeFilter = 'today' | 'week' | 'month' | 'year' | 'all';

export type Category = 'Electronics' | 'Clothing' | 'Food & Beverage' | 'Home & Living' | 'Health & Beauty';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  preferences: {
    notifications: boolean;
    language: string;
    theme: 'light' | 'dark';
  };
}
