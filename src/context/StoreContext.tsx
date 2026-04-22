import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { Product, CartItem, Sale, User, Category, Branch } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_PRODUCTS } from '../api/initialData';
import { generateId } from '../lib/utils';

interface StoreContextType {
  inventory: Product[];
  cart: CartItem[];
  sales: Sale[];
  user: User | null;
  branches: Branch[];
  selectedBranchId: string;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  checkout: (paymentMethod: Sale['paymentMethod'], customerName?: string, cardDetails?: Sale['cardDetails']) => boolean;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  login: (role: User['role']) => void;
  logout: () => void;
  clearCart: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (updates: Partial<User['preferences']>) => void;
  addBranch: (branch: Omit<Branch, 'id'>) => void;
  deleteBranch: (id: string) => void;
  selectBranch: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [inventory, setInventory] = useLocalStorage<Product[]>('steadi_inventory', INITIAL_PRODUCTS);
  const [cart, setCart] = useLocalStorage<CartItem[]>('steadi_cart', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('steadi_sales', []);
  const [user, setUser] = useLocalStorage<User | null>('steadi_user', null);
  const [branches, setBranches] = useLocalStorage<Branch[]>('steadi_branches', [
    { id: 'main', name: 'Main Branch', location: 'Karachi, PK' }
  ]);
  const [selectedBranchId, setSelectedBranchId] = useLocalStorage<string>('steadi_selected_branch', 'main');

  const login = (role: User['role']) => {
    setUser({
      id: generateId(),
      name: role === 'admin' ? 'Admin User' : 'Staff Member',
      email: role === 'admin' ? 'admin@steadi.stock' : 'staff@steadi.stock',
      role,
      preferences: {
        notifications: true,
        language: 'English',
        theme: 'light',
      },
    });
  };

  const logout = () => setUser(null);

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const updatePreferences = (updates: Partial<User['preferences']>) => {
    if (user) {
      setUser({
        ...user,
        preferences: { ...user.preferences, ...updates }
      });
    }
  };

  const addBranch = (branch: Omit<Branch, 'id'>) => {
    setBranches([...branches, { ...branch, id: generateId() }]);
  };

  const deleteBranch = (id: string) => {
    if (id === 'main') return; // Cannot delete main
    setBranches(branches.filter(b => b.id !== id));
    if (selectedBranchId === id) setSelectedBranchId('main');
  };

  const selectBranch = (id: string) => setSelectedBranchId(id);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    const stockAvailable = product.stock;

    if (existing) {
      if (existing.quantity < stockAvailable) {
        setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
    } else {
      if (stockAvailable > 0) {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const product = inventory.find(p => p.id === productId);
    if (!product) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (quantity <= product.stock) {
      setCart(cart.map(item => item.id === productId ? { ...item, quantity } : item));
    }
  };

  const clearCart = () => setCart([]);

  const checkout = (
    paymentMethod: Sale['paymentMethod'], 
    customerName?: string, 
    cardDetails?: Sale['cardDetails']
  ) => {
    if (cart.length === 0) return false;

    // Check stock for all items
    const canCheckout = cart.every(item => {
      const invItem = inventory.find(p => p.id === item.id);
      return invItem && invItem.stock >= item.quantity;
    });

    if (!canCheckout) return false;

    // Deduct stock
    const newInventory = inventory.map(invItem => {
      const cartItem = cart.find(ci => ci.id === invItem.id);
      if (cartItem) {
        return { ...invItem, stock: invItem.stock - cartItem.quantity };
      }
      return invItem;
    });

    // Create sale record
    const newSale: Sale = {
      id: `SALE-${generateId()}`,
      timestamp: new Date().toISOString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      paymentMethod,
      customerName,
      branchId: selectedBranchId,
      customerId: `CUST-${generateId()}`,
      cardDetails
    };

    setInventory(newInventory);
    setSales([newSale, ...sales]);
    setCart([]);
    return true;
  };

  const addProduct = (product: Omit<Product, 'id' | 'branchId'>) => {
    const newProduct: Product = { ...product, id: `PRD-${generateId()}`, branchId: selectedBranchId };
    setInventory([...inventory, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setInventory(inventory.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setInventory(inventory.filter(p => p.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      inventory, cart, sales, user, branches, selectedBranchId,
      addToCart, removeFromCart, updateCartQuantity,
      checkout, addProduct, updateProduct, deleteProduct,
      login, logout, clearCart, updateUser, updatePreferences,
      addBranch, deleteBranch, selectBranch
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
