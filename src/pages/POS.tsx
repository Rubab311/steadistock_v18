import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Helmet } from 'react-helmet-async';
import { Search, ShoppingCart, Plus, Minus, Trash2, Printer, ShieldCheck, Shield, ChevronRight, XCircle, ShoppingBag } from 'lucide-react';
import { formatCurrency, cn, generateId } from '../lib/utils';
import { CATEGORIES } from '../api/initialData';
import { Product, CartItem, Sale } from '../types';

export const POS = () => {
  const { inventory, cart, addToCart, removeFromCart, updateCartQuantity, checkout, clearCart, selectedBranchId } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Sale['paymentMethod']>('Cash on Delivery');
  
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  });

  const filteredProducts = inventory.filter(p => {
    const isCurrentBranch = (p.branchId || 'main') === selectedBranchId;
    if (!isCurrentBranch) return false;
    
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const performCheckout = (cardDetails?: Sale['cardDetails']) => {
    const success = checkout(paymentMethod, customerName, cardDetails);
    if (success) {
      // Get the last added sale from store logic (indirectly)
      const sale: Sale = {
          id: `SALE-${generateId()}`,
          timestamp: new Date().toISOString(),
          items: [...cart],
          total: cartTotal,
          paymentMethod,
          customerName,
          branchId: selectedBranchId,
          customerId: `CUST-${generateId()}`,
          cardDetails
      };
      setLastSale(sale);
      setIsReceiptOpen(true);
      setIsCardModalOpen(false);
      setIsCashModalOpen(false);
      setCustomerName('');
      setCardData({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' });
    } else {
      alert('Checkout failed. Please check stock levels.');
    }
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'Card') {
      setIsCardModalOpen(true);
    } else {
      setIsCashModalOpen(true);
    }
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lastFour = cardData.cardNumber.slice(-4);
    performCheckout({ lastFour, cardType: 'Visa/Master' });
    setIsCardModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-500">
      <Helmet>
        <title>POS System | SteadiStock</title>
      </Helmet>

      <div className="flex flex-col lg:flex-row gap-6" style={{ minHeight: 'calc(100vh - 140px)' }}>
        {/* Product Browser */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-neutral-text">Checkout Terminal</h1>
            <div className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary rounded-xl text-white font-black text-sm">
              <ShoppingCart size={18} />
              <span>{cart.length}</span>
            </div>
          </div>

          {/* Search bar — full width */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category filters — own row */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {['All', ...CATEGORIES].map(c => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={cn(
                  'px-4 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest whitespace-nowrap transition-all border shrink-0',
                  selectedCategory === c
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                    : 'bg-white text-neutral-secondary border-gray-200 hover:border-primary/30'
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
              {filteredProducts.map((product) => {
                const inCart = cart.find(i => i.id === product.id)?.quantity || 0;
                const stockRemaining = product.stock - inCart;

                return (
                  <button
                    key={product.id}
                    disabled={stockRemaining <= 0}
                    onClick={() => addToCart(product)}
                    className={cn(
                      'group relative bg-white rounded-2xl p-3 text-left border border-gray-100 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all flex flex-col gap-3 disabled:opacity-50',
                      stockRemaining <= 0 && 'cursor-not-allowed grayscale'
                    )}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                      <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      {inCart > 0 && (
                        <div className="absolute top-2 right-2 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-md animate-in zoom-in duration-200">
                          {inCart}
                        </div>
                      )}
                      {stockRemaining <= 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2">
                          <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full whitespace-nowrap">OUT OF STOCK</span>
                        </div>
                      )}
                    </div>
                    {/* Product info — name then price + stock on separate lines */}
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-neutral-text truncate leading-tight">{product.name}</p>
                      <p className="text-sm font-black text-primary">{formatCurrency(product.price)}</p>
                      <p className="text-[10px] font-semibold text-neutral-secondary uppercase tracking-wide">{stockRemaining} left in stock</p>
                    </div>
                  </button>
                );
              })}
              {filteredProducts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <Search size={40} className="text-gray-300 mb-3" />
                  <p className="text-sm font-bold text-neutral-text">No products found</p>
                  <p className="text-xs text-neutral-secondary mt-1">Try a different search or category</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cart Side Panel */}
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden p-0">
            {/* Cart Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-primary" />
                <h2 className="text-lg font-black text-neutral-text">Cart</h2>
                {cart.length > 0 && (
                  <span className="bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{cart.length}</span>
                )}
              </div>
              <button
                onClick={clearCart}
                className="text-[10px] font-bold text-neutral-secondary uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center opacity-40 py-10">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <ShoppingBag size={32} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-bold text-neutral-text">Your cart is empty</p>
                  <p className="text-xs font-medium text-neutral-secondary mt-1 px-4">Select products from the grid to add them here.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <img src={item.image} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2 mb-2">
                        <p className="text-xs font-bold text-neutral-text truncate leading-tight">{item.name}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                          <Plus size={14} className="rotate-45" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-black text-primary">{formatCurrency(item.price * item.quantity)}</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-neutral-secondary hover:bg-primary hover:text-white hover:border-primary transition-all"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-neutral-secondary hover:bg-primary hover:text-white hover:border-primary transition-all"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            <div className="px-6 py-5 border-t border-gray-100 space-y-4">
              <Input
                placeholder="Customer Name (Optional)"
                className="h-11 text-sm"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <div>
                <p className="text-[10px] font-black text-neutral-secondary uppercase tracking-widest mb-2">Payment Method</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['Cash on Delivery', 'Card'] as Sale['paymentMethod'][]).map(m => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={cn(
                        'py-3 px-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border',
                        paymentMethod === m
                          ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                          : 'bg-gray-50 text-neutral-secondary border-gray-200 hover:border-primary/30'
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end justify-between pt-1">
                <div>
                  <p className="text-[10px] font-bold text-neutral-secondary uppercase tracking-widest">Order Total</p>
                  <h3 className="text-3xl font-black text-neutral-text tracking-tighter mt-0.5">{formatCurrency(cartTotal)}</h3>
                </div>
                {cart.length > 0 && (
                  <p className="text-xs text-neutral-secondary font-medium">{cart.reduce((s, i) => s + i.quantity, 0)} item(s)</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  disabled={cart.length === 0}
                  onClick={clearCart}
                  className="w-full h-12 font-black tracking-widest uppercase text-xs"
                >
                  CANCEL
                </Button>
                <Button
                  disabled={cart.length === 0}
                  onClick={handleCheckoutClick}
                  className="w-full h-12 font-black tracking-widest text-sm shadow-xl shadow-primary/30"
                >
                  CHECKOUT
                  <ChevronRight size={18} className="ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Receipt Modal */}
      {isReceiptOpen && lastSale && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md print:p-0 print:bg-white print:backdrop-blur-none">
           <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 print:shadow-none print:rounded-none">
              <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh] print:max-h-full">
                 <div className="text-center space-y-2 pb-4 border-b border-dashed border-gray-200">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mx-auto mb-2 print:border print:border-primary">
                        <ShieldCheck size={28} />
                    </div>
                    <h3 className="text-xl font-black text-neutral-text italic tracking-tighter">SteadiStock</h3>
                    <p className="text-[10px] font-bold text-neutral-secondary uppercase tracking-[0.3em] leading-none mt-1">Official Receipt</p>
                 </div>

                 <div className="flex justify-between items-start gap-4 py-3 border-b border-gray-50 mb-4">
                    <div className="text-left flex-1 min-w-0">
                       <p className="text-[8px] font-black text-neutral-secondary uppercase tracking-widest leading-none mb-1">ID Ref</p>
                       <p className="text-[10px] font-bold text-neutral-text truncate">{lastSale.id}</p>
                    </div>
                    <div className="text-right flex-1 shrink-0">
                       <p className="text-[8px] font-black text-neutral-secondary uppercase tracking-widest leading-none mb-1 text-right">Date/Time</p>
                       <p className="text-[10px] font-bold text-neutral-text whitespace-nowrap">{new Date(lastSale.timestamp).toLocaleDateString()} {new Date(lastSale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    {lastSale.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs font-bold">
                         <div className="flex-1 pr-4">
                            <span className="text-neutral-text">{item.name}</span>
                            <span className="text-neutral-secondary ml-2">x{item.quantity}</span>
                         </div>
                         <span className="text-neutral-text font-black">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                 </div>

                 <div className="pt-4 border-t border-dashed border-gray-200 space-y-2">
                    <div className="flex justify-between text-sm font-black text-neutral-text">
                       <span>Total Amount</span>
                       <span className="text-primary">{formatCurrency(lastSale.total)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-neutral-secondary uppercase tracking-widest pt-2">
                       <span>Payment Mode</span>
                       <span>{lastSale.paymentMethod}</span>
                    </div>
                    {lastSale.customerName && (
                      <div className="flex justify-between text-[10px] font-bold text-neutral-secondary uppercase tracking-widest">
                         <span>Customer</span>
                         <span>{lastSale.customerName}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[10px] font-bold text-neutral-secondary uppercase tracking-widest">
                       <span>Timestamp</span>
                       <span>{new Date(lastSale.timestamp).toLocaleString()}</span>
                    </div>
                    {lastSale.customerId && (
                      <div className="flex justify-between text-[10px] font-bold text-neutral-secondary uppercase tracking-widest">
                         <span>Customer ID</span>
                         <span>{lastSale.customerId}</span>
                      </div>
                    )}
                    {lastSale.cardDetails && (
                      <div className="flex justify-between text-[10px] font-bold text-neutral-secondary uppercase tracking-widest">
                         <span>Card Used</span>
                         <span>**** {lastSale.cardDetails.lastFour}</span>
                      </div>
                    )}
                 </div>

                 <div className="text-center pt-4 print:hidden">
                    <p className="text-[10px] font-medium text-neutral-secondary italic mb-6">Thank you for shopping at SteadiStock!</p>
                    <div className="flex gap-3">
                       <Button onClick={handlePrint} variant="outline" className="flex-1 gap-2 text-xs">
                          <Printer size={16} />
                          PRINT
                       </Button>
                       <Button onClick={() => setIsReceiptOpen(false)} className="flex-1 text-xs">
                          DONE
                       </Button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Card Details Modal */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <Card className="w-full max-w-md animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-xl font-black text-neutral-text">CARD PAYMENT</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-secondary">Secure Transaction</p>
                 </div>
                 <button onClick={() => setIsCardModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <XCircle size={24} className="text-gray-300" />
                 </button>
              </div>

              <form onSubmit={handleCardSubmit} className="space-y-4">
                 <Input 
                   label="Card Number" 
                   placeholder="0000 0000 0000 0000" 
                   maxLength={19}
                   required
                   value={cardData.cardNumber}
                   onChange={e => setCardData({...cardData, cardNumber: e.target.value})}
                 />
                 <Input 
                   label="Card Holder Name" 
                   placeholder="Full name as on card" 
                   required
                   value={cardData.cardHolder}
                   onChange={e => setCardData({...cardData, cardHolder: e.target.value})}
                 />
                 <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Expiry Date" 
                      placeholder="MM/YY" 
                      maxLength={5}
                      required
                      value={cardData.expiry}
                      onChange={e => setCardData({...cardData, expiry: e.target.value})}
                    />
                    <Input 
                      label="CVV" 
                      type="password"
                      placeholder="***" 
                      maxLength={3}
                      required
                      value={cardData.cvv}
                      onChange={e => setCardData({...cardData, cvv: e.target.value})}
                    />
                 </div>
                 <div className="pt-4 flex gap-4">
                    <Button type="button" variant="ghost" onClick={() => setIsCardModalOpen(false)} className="flex-1 font-bold">CANCEL</Button>
                    <Button type="submit" className="flex-1 font-bold">PAY {formatCurrency(cartTotal)}</Button>
                 </div>
              </form>
           </Card>
        </div>
      )}

      {/* Cash Payment Confirmation Modal */}
      {isCashModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <Card className="w-full max-w-sm animate-in zoom-in-95 duration-200">
              <div className="text-center p-4">
                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 font-black text-2xl">
                    Rs
                 </div>
                 <h2 className="text-xl font-black text-neutral-text uppercase italic">Cash Transaction</h2>
                 <p className="text-xs text-neutral-secondary font-medium mb-6 mt-1">Please confirm the received amount from the customer.</p>
                 
                 <div className="bg-gray-50 border border-dashed border-gray-200 p-6 rounded-2xl mb-8">
                    <p className="text-[10px] font-black text-neutral-secondary uppercase tracking-[0.2em] mb-1">Total Payable</p>
                    <h3 className="text-4xl font-black text-primary tracking-tighter">{formatCurrency(cartTotal)}</h3>
                 </div>

                 <div className="flex flex-col gap-3">
                    <Button onClick={() => performCheckout()} className="w-full h-12 font-black tracking-widest text-xs uppercase shadow-lg shadow-primary/20">
                       CONFIRM RECEIVED
                    </Button>
                    <Button variant="ghost" onClick={() => setIsCashModalOpen(false)} className="w-full h-12 font-bold text-gray-400">
                       CANCEL & GO BACK
                    </Button>
                 </div>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
};
