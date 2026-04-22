import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HelpCircle, Search, PlayCircle, MessageSquare, BookOpen, ChevronRight, ShoppingCart, Package, BarChart3, Globe, Shield, HardDrive } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

export const Help = () => {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

  const faqs = [
    { 
      q: 'How do I add a product with multiple units?', 
      a: 'Go to Inventory > Add New Product. Enter the total quantity in the "Stock" field. You can update this later using the edit button.' 
    },
    { 
      q: 'Can I export my sales history?', 
      a: 'Yes, navigate to the Reports section. Use the "PRINT REPORT" button to save as PDF or print your historical logs.' 
    },
    { 
      q: 'What happens if I lose my connection?', 
      a: 'SteadiStock uses local caching. You can continue adding items to cart, but finalizing checkout requires a stable connection for sync.' 
    },
    { 
      q: 'How to set up a new staff member?', 
      a: 'Currently, the system defaults to an Admin role. Multi-user management can be configured in the advanced profile settings.' 
    }
  ];

  const categories = [
    { icon: PlayCircle, title: 'Basics', count: 4 },
    { icon: ShoppingCart, title: 'Checkout', count: 3 },
    { icon: Package, title: 'Stock', count: 5 },
    { icon: BarChart3, title: 'Data', count: 2 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <Helmet>
        <title>Help & Support | SteadiStock</title>
      </Helmet>

      <div className="flex flex-col md:flex-row items-center gap-8 py-10 px-8 bg-neutral-text rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative flex-1 space-y-4">
           <h1 className="text-4xl font-black tracking-tight italic">How can we assist you?</h1>
           <p className="text-xs font-bold opacity-60 uppercase tracking-widest max-w-md">Access our structured documentation or connect with an integrity expert.</p>
           <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10">
                 <MessageSquare size={14} className="text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest">+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10">
                 <Globe size={14} className="text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest italic">support@steadistock.com</span>
              </div>
           </div>
        </div>
        <div className="relative w-full md:w-96 bg-white p-6 rounded-3xl shadow-xl space-y-4 text-neutral-text">
           <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <MessageSquare className="text-primary" size={20} />
              <h3 className="text-xs font-black uppercase tracking-widest">Send us a message</h3>
           </div>
           <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert('Message sent to our support team!'); }}>
              <input 
                type="text" 
                placeholder="Subject" 
                className="w-full bg-gray-50 border-0 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20"
                required
              />
              <textarea 
                placeholder="How can we help?" 
                className="w-full bg-gray-50 border-0 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-primary/20 min-h-[80px]"
                required
              />
              <Button type="submit" className="w-full h-10 text-[10px] font-black tracking-widest">SEND MESSAGE</Button>
           </form>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[10px] font-black text-neutral-secondary uppercase tracking-[0.2em] pl-1">Frequently Asked</h3>
            <div className="space-y-3">
               {faqs.map((faq, i) => (
                 <Card key={i} className="p-0 border-gray-100">
                    <button 
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left"
                    >
                       <span className="text-sm font-black text-neutral-text uppercase tracking-tight">{faq.q}</span>
                       <ChevronRight size={16} className={cn("text-gray-300 transition-transform", activeFaq === i && "rotate-90 text-primary")} />
                    </button>
                    {activeFaq === i && (
                      <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                         <p className="text-xs font-medium text-neutral-secondary leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {faq.a}
                         </p>
                      </div>
                    )}
                 </Card>
               ))}
            </div>
         </div>

         <div className="space-y-4">
            <h3 className="text-[10px] font-black text-neutral-secondary uppercase tracking-[0.2em] pl-1">Systems Status</h3>
            <Card className="bg-success/5 border-success/20">
               <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <div>
                     <p className="text-xs font-black text-neutral-text uppercase tracking-widest">Operational</p>
                     <p className="text-[10px] text-emerald-600 font-bold">ALL SYSTEMS LIVE</p>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};
