import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Helmet } from 'react-helmet-async';
import { Package, Plus, Search, Filter, Trash2, Edit3, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { CATEGORIES } from '../api/initialData';
import { Product } from '../types';

export const Inventory = () => {
  const { inventory, addProduct, updateProduct, deleteProduct, user, selectedBranchId } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const isAdmin = user?.role === 'admin';

  const filteredInventory = inventory.filter(p => {
    const isCurrentBranch = (p.branchId || 'main') === selectedBranchId;
    if (!isCurrentBranch) return false;
    
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    price: 0,
    stock: 0,
    image: '',
    description: ''
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        image: product.image,
        description: product.description || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: CATEGORIES[0],
        price: 0,
        stock: 0,
        image: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Helmet>
        <title>Inventory | SteadiStock</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-neutral-text">Inventory Control</h1>
          <p className="text-neutral-secondary font-medium mt-1">Manage your stock levels, pricing, and product catalog.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => handleOpenModal()} className="flex items-center gap-2 font-bold shadow-lg shadow-primary/20">
            <Plus size={20} />
            <span>ADD NEW PRODUCT</span>
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
           <Filter className="text-neutral-secondary" size={18} />
           <select 
             className="bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-xs uppercase tracking-widest text-neutral-secondary"
             value={selectedCategory}
             onChange={(e) => setSelectedCategory(e.target.value)}
           >
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
           </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-neutral-secondary uppercase tracking-[0.2em]">
                   <th className="px-6 py-4 min-w-[200px]">Product Info</th>
                   <th className="px-6 py-4 min-w-[140px]">Category</th>
                   <th className="px-6 py-4 text-center min-w-[100px]">Unit Price</th>
                   <th className="px-6 py-4 text-center min-w-[120px]">In Stock</th>
                   <th className="px-6 py-4 text-right min-w-[100px]">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {filteredInventory.map((product) => (
                   <tr key={product.id} className={cn('hover:bg-gray-50/50 transition-colors', product.stock < 10 && 'bg-red-50/20')}>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 group relative cursor-zoom-in">
                               <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                               {product.stock < 10 && (
                                 <div className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl-lg">
                                   <AlertCircle size={10} />
                                 </div>
                               )}
                            </div>
                            <div>
                               <p className="text-sm font-black text-neutral-text">{product.name}</p>
                               <p className="text-[10px] text-neutral-secondary font-bold tracking-widest uppercase">{product.id}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-xs font-bold px-3 py-1 bg-gray-100 rounded-full text-neutral-secondary">
                            {product.category}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-center font-black text-neutral-text">
                         {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col items-center gap-1">
                            <span className={cn('text-xs font-black', product.stock < 10 ? 'text-red-500' : 'text-neutral-text')}>
                               {product.stock} Units
                            </span>
                            <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                               <div className={cn('h-full transition-all duration-1000', product.stock < 10 ? 'bg-red-500' : 'bg-success')} style={{ width: `${Math.min(product.stock * 2, 100)}%` }} />
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                         <button 
                           onClick={() => handleOpenModal(product)}
                           className="p-2 text-neutral-secondary hover:text-primary transition-colors hover:bg-primary/10 rounded-lg"
                         >
                            <Edit3 size={18} />
                         </button>
                         {isAdmin && (
                           <button 
                             onClick={() => deleteProduct(product.id)}
                             className="p-2 text-neutral-secondary hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg"
                           >
                              <Trash2 size={18} />
                           </button>
                         )}
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
          {filteredInventory.length === 0 && (
            <div className="py-20 text-center">
               <Package size={48} className="mx-auto text-gray-200 mb-4" />
               <h3 className="text-lg font-bold text-neutral-text">No products match your filters</h3>
               <p className="text-sm text-neutral-secondary">Try adjusting your search term or category selection.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 fade-in duration-200 shadow-2xl">
              <div className="px-8 py-6 bg-primary text-white flex items-center justify-between">
                 <div>
                    <h2 className="text-xl font-black tracking-tight">{editingProduct ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</h2>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest leading-none mt-1">Inventory Management Service</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                    <Plus size={24} className="rotate-45" />
                 </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                 <div className="space-y-4">
                    <Input 
                      label="Product Name" 
                      placeholder="e.g. Samsung 65 inch TV" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-neutral-text pl-1">Category</label>
                          <select 
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                          >
                             {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                       </div>
                       <div className="space-y-1.5 min-w-0">
                          <label className="text-sm font-semibold text-neutral-text pl-1">Product Photo</label>
                          <div className="flex flex-col gap-2">
                             <div className="flex gap-2">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  className="shrink-0 h-10 text-[10px] font-black uppercase tracking-widest gap-2"
                                  onClick={() => document.getElementById('fileInput')?.click()}
                                >
                                   <Plus size={14} />
                                   Device
                                </Button>
                                <Input 
                                  placeholder="Web Link / URL Source..." 
                                  value={formData.image.startsWith('data:') ? 'Local Image (Uploaded)' : formData.image}
                                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                                  className="flex-1 h-10 text-xs"
                                />
                             </div>
                             <input 
                               id="fileInput"
                               type="file" 
                               className="hidden" 
                               accept="image/*"
                               onChange={handleFileChange}
                             />
                          </div>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <Input 
                         label="Unit Price (Rs.)" 
                         type="number" 
                         step="1" 
                         required
                         value={formData.price}
                         onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                       />
                       <Input 
                         label="Stock Quantity" 
                         type="number" 
                         required
                         value={formData.stock}
                         onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                       />
                    </div>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1 font-bold">CANCEL</Button>
                    <Button type="submit" className="flex-1 font-bold shadow-lg shadow-primary/30">
                       {editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                    </Button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
