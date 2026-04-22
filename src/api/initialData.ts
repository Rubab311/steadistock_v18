import { Product, Category } from '../types';

export const CATEGORIES: Category[] = [
  'Electronics',
  'Clothing',
  'Food & Beverage',
  'Home & Living',
  'Health & Beauty'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PRD-001',
    name: 'Samsung 65 inch TV',
    category: 'Electronics',
    price: 899.99,
    stock: 15,
    image: 'https://picsum.photos/seed/tv/400/300',
    branchId: 'main'
  },
  {
    id: 'PRD-002',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 199.99,
    stock: 25,
    image: 'https://picsum.photos/seed/headphones/400/300',
    branchId: 'main'
  },
  {
    id: 'PRD-003',
    name: 'Cotton T-Shirt',
    category: 'Clothing',
    price: 29.99,
    stock: 100,
    image: 'https://picsum.photos/seed/shirt/400/300',
    branchId: 'main'
  }
];
