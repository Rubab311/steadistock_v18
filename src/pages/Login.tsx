import React, { useState } from 'react';
import { ShieldCheck, User as UserIcon, Lock, Mail, ArrowRight, XCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Helmet } from 'react-helmet-async';

export const Login = () => {
  const { login } = useStore();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('admin');
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sign up and then login
    alert('Account created successfully! Auto-logging in...');
    login('admin');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Success! Password reset instructions have been sent to: ${resetEmail}`);
    setIsForgotModalOpen(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-soft p-6 relative overflow-hidden">
      <Helmet>
        <title>{activeTab === 'login' ? 'Login' : 'Sign Up'} | SteadiStock</title>
      </Helmet>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px]" />
      </div>
      
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/30 transform transition-transform hover:scale-110 duration-500">
            <ShieldCheck size={40} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-neutral-text tracking-tighter italic">SteadiStock</h1>
            <p className="text-neutral-secondary font-black uppercase tracking-[0.3em] text-[10px]">Commercial Operations Suite</p>
          </div>
        </div>

        <Card className="p-1 border-0 ring-1 ring-black/5 shadow-2xl overflow-hidden bg-white/80 backdrop-blur-md">
          {/* Tabs UI */}
          <div className="flex bg-gray-50/50 p-1 mb-6">
             <button 
               onClick={() => setActiveTab('login')}
               className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'login' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-neutral-text'}`}
             >
                Existing User
             </button>
             <button 
               onClick={() => setActiveTab('signup')}
               className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'signup' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-neutral-text'}`}
             >
                New Branch
             </button>
          </div>

          <div className="px-8 pb-8 space-y-6">
            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
                <Input 
                   label="Operations ID / Email" 
                   icon={<Mail size={16} />}
                   placeholder="admin@steadi.stock" 
                />
                <div className="space-y-2">
                  <Input 
                     label="Password" 
                     icon={<Lock size={16} />}
                     type="password" 
                     placeholder="••••••••" 
                  />
                  <div className="text-right">
                     <button 
                       type="button"
                       onClick={() => setIsForgotModalOpen(true)}
                       className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                     >
                        Forgot Access Key?
                     </button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 font-black text-xs tracking-[.2em] shadow-xl shadow-primary/30 group">
                  AUTHORIZE ACCESS
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
                <Input 
                   label="Business Name" 
                   icon={<UserIcon size={16} />}
                   placeholder="e.g. Al-Madina Traders" 
                />
                <Input 
                   label="Email Address" 
                   icon={<Mail size={16} />}
                   placeholder="office@steadistock.com" 
                />
                <Input 
                   label="New Password" 
                   icon={<Lock size={16} />}
                   type="password" 
                   placeholder="Minimum 8 characters" 
                />
                <Button type="submit" className="w-full h-14 font-black text-xs tracking-[.2em] shadow-xl shadow-primary/30">
                  CREATE WORKSPACE
                </Button>
              </form>
            )}

            <p className="text-center text-[10px] text-neutral-secondary font-bold uppercase tracking-widest opacity-60">
               Secured via RSA 4096-bit Encryption
            </p>
          </div>
        </Card>

        <div className="text-center space-y-2">
           <p className="text-[10px] text-neutral-secondary font-black uppercase tracking-widest">
              © 2026 SteadiStock Professional V2.4
           </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <Card className="w-full max-w-sm animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-black text-neutral-text uppercase tracking-tight italic">Recover Access Key</h2>
                 <button onClick={() => setIsForgotModalOpen(false)}>
                    <XCircle size={24} className="text-gray-300 hover:text-red-500 transition-colors" />
                 </button>
              </div>
              <p className="text-xs text-neutral-secondary font-medium mb-6">Enter your registered email address to receive recovery instructions.</p>
              <form onSubmit={handleForgotPassword} className="space-y-5">
                 <Input 
                   label="Email Address" 
                   placeholder="admin@steadi.stock"
                   value={resetEmail}
                   onChange={e => setResetEmail(e.target.value)}
                   type="email"
                   required
                   autoFocus
                 />
                 <Button type="submit" className="w-full font-black text-[10px] tracking-widest">SEND RESET LINK</Button>
              </form>
           </Card>
        </div>
      )}
    </div>
  );
};
