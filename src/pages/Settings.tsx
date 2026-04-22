import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings as SettingsIcon, Bell, Shield, User as UserIcon, Globe, Moon, ChevronRight, HardDrive, LogOut, XCircle, CreditCard, Building2, Plus, Trash2, MapPin } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { cn } from '../lib/utils';

export const Settings = () => {
  const { user, updateUser, updatePreferences, logout, clearCart, branches, addBranch, deleteBranch } = useStore();
  const navigate = useNavigate();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isPublicIdOpen, setIsPublicIdOpen] = useState(false);
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [isEraseModalOpen, setIsEraseModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<{id: string, name: string} | null>(null);
  const [eraseEmail, setEraseEmail] = useState('');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [branchForm, setBranchForm] = useState({
    name: '',
    location: '',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileForm);
    setIsEditProfileOpen(false);
  };

  const handleAddBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (branchForm.name && branchForm.location) {
      addBranch(branchForm);
      setBranchForm({ name: '', location: '' });
      setIsAddBranchOpen(false);
    }
  };

  const handleEraseData = (e: React.FormEvent) => {
    e.preventDefault();
    if (eraseEmail !== user?.email) {
      alert('Email address does not match. Security verification failed.');
      return;
    }
    
    localStorage.clear();
    window.location.reload();
  };

  const sections = [
    {
      title: 'Legal & Policies',
      items: [
        { label: 'Privacy Policy', path: '/policies/privacy', icon: Shield },
        { label: 'Terms of Service', path: '/policies/terms', icon: Globe },
        { label: 'Security Guidelines', path: '/policies/security', icon: HardDrive },
      ]
    }
  ];

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <Helmet>
        <title>Settings | SteadiStock</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-black text-neutral-text">System Settings</h1>
        <p className="text-neutral-secondary font-medium mt-1">Configure your workspace preference and view legal information.</p>
      </div>

      <div className="space-y-6">
        <Card className="overflow-hidden p-0 border-none shadow-2xl shadow-primary/5">
           <div className="flex flex-col lg:flex-row">
              {/* Profile Sidebar */}
              <div className="lg:w-72 bg-white p-8 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-primary/80">
                 <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-primary border-2 border-black/20 flex items-center justify-center text-white font-black text-3xl shadow-2xl transition-transform group-hover:scale-105 duration-500">
                       {user.name[0]}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 border-4 border-primary rounded-full shadow-lg" title="System Online" />
                 </div>

                 <div className="mt-6 text-center">
                    <h2 className="text-xl font-black text-neutral-text uppercase tracking-tight leading-none">{user.name}</h2>
                    <p className="mt-2 text-[10px] font-black text-primary bg-primary/20 border border-white/20 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                       {user.role}
                    </p>
                 </div>

                 <div className="mt-8 w-full space-y-3 pt-6 border-t border-black/20">
                    <div className="flex items-center justify-between text-[10px] font-bold text-primary uppercase tracking-widest">
                       <span>Profile ID</span>
                       <span className="text-neutral-text font-black">#{user.id.slice(0, 7)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-primary uppercase tracking-widest">
                       <span>Status</span>
                       <span className="text-green-300 font-black">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-primary uppercase tracking-widest">
                       <span>Joined</span>
                       <span className="text-neutral-text font-black">APR 2026</span>
                    </div>
                 </div>
              </div>

              {/* Profile Actions & Info */}
              <div className="flex-1 p-8 flex flex-col justify-between bg-white dark:bg-slate-900">
                 <div>
                    <h3 className="text-xs font-black text-neutral-secondary uppercase tracking-[0.2em] mb-6">User Permissions & Access</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Authorization Level</p>
                          <p className="text-sm font-bold text-white">Full System Access</p>
                       </div>
                       <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Multi-Branch Ops</p>
                          <p className="text-sm font-bold text-white">All Branches Enabled</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-gray-50 dark:border-slate-800">
                    <Button onClick={() => setIsEditProfileOpen(true)} className="h-11 font-black text-[10px] tracking-widest px-6 shadow-lg shadow-primary/10">
                       EDIT PROFILE
                    </Button>
                    <Button onClick={() => setIsPublicIdOpen(true)} variant="outline" className="h-11 font-black text-[10px] tracking-widest px-6">
                       VIEW PUBLIC ID
                    </Button>
                    <br>
                    </br>
                    <Button onClick={handleLogout} variant="destructive" className="h-12 font-white text-white text-[10px] tracking-widest px-6 ml-auto group">
                       <LogOut size={14} className="mr-2 font-white transition-transform group-hover:translate-x-1" />
                       SIGN OUT
                    </Button>
                 </div>
              </div>
           </div>
        </Card>

        <div className="space-y-3">
           <h3 className="text-[10px] font-black text-neutral-secondary uppercase tracking-[0.2em] pl-1">Preferences</h3>
           <Card className="divide-y divide-gray-50 p-0 overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-white">
                 <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg transition-colors", user.preferences.notifications ? "bg-primary/10 text-primary" : "bg-gray-50 text-gray-400")}>
                       <Bell size={18} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-neutral-text">Notifications</span>
                       <span className="text-[10px] text-neutral-secondary font-medium uppercase tracking-wider">Sound and visual alerts</span>
                    </div>
                 </div>
                 <button 
                   onClick={() => updatePreferences({ notifications: !user.preferences.notifications })}
                   className={cn(
                     "w-10 h-6 rounded-full transition-all relative",
                     user.preferences.notifications ? "bg-primary" : "bg-gray-200"
                   )}
                 >
                    <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", user.preferences.notifications ? "right-1" : "left-1")} />
                 </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400 font-bold">
                       <Globe size={18} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-neutral-text">Language</span>
                       <span className="text-[10px] text-neutral-secondary font-medium uppercase tracking-wider">{user.preferences.language}</span>
                    </div>
                 </div>
                 <select 
                   className="text-xs font-bold bg-white border border-gray-100 rounded-lg px-2 py-1 focus:outline-none"
                   value={user.preferences.language}
                   onChange={e => updatePreferences({ language: e.target.value })}
                 >
                    <option>English</option>
                    <option>Urdu</option>
                    <option>Spanish</option>
                 </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-white">
                 <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg transition-colors", user.preferences.theme === 'dark' ? "bg-primary/10 text-primary" : "bg-gray-50 text-gray-400")}>
                       <Moon size={18} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-neutral-text">Theme Mode</span>
                       <span className="text-[10px] text-neutral-secondary font-medium uppercase tracking-wider">{user.preferences.theme}</span>
                    </div>
                 </div>
                 <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                      onClick={() => updatePreferences({ theme: 'light' })}
                      className={cn("px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all", user.preferences.theme === 'light' ? "bg-white text-primary shadow-sm" : "text-gray-400")}
                    >
                      Light
                    </button>
                    <button 
                      onClick={() => updatePreferences({ theme: 'dark' })}
                      className={cn("px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md transition-all", user.preferences.theme === 'dark' ? "bg-white text-primary shadow-sm" : "text-gray-400")}
                    >
                      Dark
                    </button>
                 </div>
              </div>
           </Card>
        </div>

        {user.role === 'admin' && (
          <div className="space-y-3">
             <div className="flex items-center justify-between pl-1">
                <h3 className="text-[10px] font-black text-neutral-secondary uppercase tracking-[0.2em]">Branch Management</h3>
                <button 
                  onClick={() => setIsAddBranchOpen(true)}
                  className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                   <Plus size={12} />
                   Add Branch
                </button>
             </div>
             <Card className="divide-y divide-gray-50 p-0 overflow-hidden">
                {branches.map((branch) => (
                  <div key={branch.id} className="flex items-center justify-between p-4 bg-white">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg text-primary">
                           <Building2 size={18} />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-neutral-text uppercase">{branch.name}</span>
                           <span className="text-[10px] text-neutral-secondary font-medium uppercase tracking-wider">{branch.location}</span>
                        </div>
                     </div>
                     {branch.id !== 'main' && (
                       <button 
                         onClick={() => setBranchToDelete({ id: branch.id, name: branch.name })}
                         className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                         title="Remove Branch"
                       >
                          <Trash2 size={16} />
                       </button>
                     )}
                  </div>
                ))}
             </Card>
          </div>
        )}

        {sections.map((section, i) => (
          <div key={i} className="space-y-3">
             <h3 className="text-[10px] font-black text-neutral-secondary uppercase tracking-[0.2em] pl-1">{section.title}</h3>
             <Card className="p-0 overflow-hidden">
                <div className="divide-y divide-gray-50">
                   {section.items.map((item, j) => (
                     <Link 
                       key={j} 
                       to={item.path} 
                       className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                     >
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-gray-50 rounded-lg text-neutral-secondary group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                              <item.icon size={18} />
                           </div>
                           <span className="text-sm font-bold text-neutral-text">{item.label}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                     </Link>
                   ))}
                </div>
             </Card>
          </div>
        ))}

        <div className="pt-4">
           <Card className="bg-red-50/50 border border-red-100">
              <h3 className="text-red-500 font-black text-sm uppercase tracking-widest mb-1">Security & Data</h3>
              <p className="text-xs text-red-400 font-medium mb-4">Erasing local data will reset all custom branches, inventory, and sales history permanently.</p>
              <Button onClick={() => setIsEraseModalOpen(true)} variant="danger" size="sm" className="font-black text-[10px] tracking-widest">SECURE ERASE DATA</Button>
           </Card>
        </div>
      </div>

      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <Card className="w-full max-w-md animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-black text-neutral-text">EDIT PROFILE</h2>
                 <button onClick={() => setIsEditProfileOpen(false)}>
                    <XCircle size={24} className="text-gray-300" />
                 </button>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                 <Input 
                   label="Full Name" 
                   value={profileForm.name} 
                   onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                   required 
                 />
                 <Input 
                   label="Email Address" 
                   type="email"
                   value={profileForm.email} 
                   onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                   required 
                 />
                 <div className="pt-4 flex gap-4">
                    <Button type="button" variant="ghost" onClick={() => setIsEditProfileOpen(false)} className="flex-1 font-bold">CANCEL</Button>
                    <Button type="submit" className="flex-1 font-bold">SAVE CHANGES</Button>
                 </div>
              </form>
           </Card>
        </div>
      )}

      {isPublicIdOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <Card className="w-full max-w-sm text-center animate-in zoom-in-95 duration-200">
              <div className="p-4">
                 <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                    <CreditCard size={32} />
                 </div>
                 <h2 className="text-xl font-black text-neutral-text">PUBLIC PROFILE ID</h2>
                 <p className="text-sm text-neutral-secondary mb-6 mt-1">Used for system authentication</p>
                 <div className="bg-gray-50 border border-dashed border-gray-200 p-4 rounded-xl font-mono text-lg font-black tracking-widest text-primary mb-6">
                    {user.id}
                 </div>
                 <Button onClick={() => setIsPublicIdOpen(false)} className="w-full font-bold">CLOSE</Button>
              </div>
           </Card>
        </div>
      )}

      {isAddBranchOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <Card className="w-full max-w-md animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-black text-neutral-text">ADD NEW BRANCH</h2>
                 <button onClick={() => setIsAddBranchOpen(false)}>
                    <XCircle size={24} className="text-gray-300" />
                 </button>
              </div>
              <form onSubmit={handleAddBranchSubmit} className="space-y-4">
                 <Input 
                   label="Branch Name" 
                   placeholder="e.g. Clifton Branch"
                   value={branchForm.name} 
                   onChange={e => setBranchForm({...branchForm, name: e.target.value})}
                   required 
                 />
                 <Input 
                   label="Location / Address" 
                   placeholder="e.g. Block 5, Clifton, Karachi"
                   value={branchForm.location} 
                   onChange={e => setBranchForm({...branchForm, location: e.target.value})}
                   required 
                 />
                 <div className="pt-4 flex gap-4">
                    <Button type="button" variant="ghost" onClick={() => setIsAddBranchOpen(false)} className="flex-1 font-bold">CANCEL</Button>
                    <Button type="submit" className="flex-1 font-bold">CREATE BRANCH</Button>
                 </div>
              </form>
           </Card>
        </div>
      )}

      {branchToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <Card className="w-full max-w-md animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-xl font-black text-neutral-text uppercase">Remove Branch?</h2>
                    <p className="text-[10px] font-bold text-neutral-secondary uppercase tracking-widest mt-1">Authorization Required</p>
                 </div>
                 <button onClick={() => setBranchToDelete(null)}>
                    <XCircle size={24} className="text-gray-300" />
                 </button>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-xl mb-6 flex gap-3 items-start border border-amber-100">
                 <Shield size={20} className="text-amber-500 shrink-0" />
                 <p className="text-[11px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
                    Warning: Deleting <span className="text-amber-900 font-black">"{branchToDelete.name}"</span> will remove all associated inventory and sales records permanently.
                    <br /><br />
                    <span className="text-red-600 font-black">IMPORTANT: PLEASE ENSURE YOU HAVE PRINTED OR EXPORTED THE BRANCH ANALYTICS BEFORE PROCEEDING.</span>
                 </p>
              </div>

              <div className="flex flex-col gap-3">
                 <Link to="/reports" className="w-full" onClick={() => setBranchToDelete(null)}>
                    <Button variant="outline" className="w-full font-black text-[10px] tracking-widest py-4">
                       GO TO REPORTS (EXPORT DATA)
                    </Button>
                 </Link>
                 <div className="flex gap-4">
                    <Button type="button" variant="ghost" onClick={() => setBranchToDelete(null)} className="flex-1 font-bold">CANCEL</Button>
                    <Button 
                      variant="danger" 
                      className="flex-1 font-bold shadow-lg shadow-red-200"
                      onClick={() => {
                        deleteBranch(branchToDelete.id);
                        setBranchToDelete(null);
                      }}
                    >
                       CONFIRM DELETE
                    </Button>
                 </div>
              </div>
           </Card>
        </div>
      )}

      {isEraseModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <Card className="w-full max-w-md animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-xl font-black text-red-600">SECURE DATA ERASURE</h2>
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-1">Permanent Removal Authorization</p>
                 </div>
                 <button onClick={() => setIsEraseModalOpen(false)}>
                    <XCircle size={24} className="text-gray-300" />
                 </button>
              </div>
              
              <div className="bg-red-50 p-4 rounded-xl mb-6 flex gap-3 items-start">
                 <Shield size={20} className="text-red-500 shrink-0" />
                 <p className="text-[11px] font-bold text-red-600 leading-relaxed uppercase tracking-tight">
                    This action will wipe all inventory, branch data, and sales logs from this device. To proceed, please enter your registered email address.
                 </p>
              </div>

              <form onSubmit={handleEraseData} className="space-y-4">
                 <Input 
                   label="Verification Email" 
                   type="email"
                   placeholder={user?.email}
                   value={eraseEmail} 
                   onChange={e => setEraseEmail(e.target.value)}
                   required 
                 />
                 <div className="pt-4 flex gap-4">
                    <Button type="button" variant="ghost" onClick={() => setIsEraseModalOpen(false)} className="flex-1 font-bold">CANCEL</Button>
                    <Button type="submit" variant="danger" className="flex-1 font-bold shadow-lg shadow-red-200">WIPE ALL DATA</Button>
                 </div>
              </form>
           </Card>
        </div>
      )}

      <div className="text-center py-10 border-t border-gray-100">
         <p className="text-[10px] font-black text-neutral-text uppercase tracking-widest">SteadiStock Core Enterprise</p>
         <div className="flex items-center justify-center gap-4 mt-2">
            <span className="text-[10px] text-neutral-secondary font-bold uppercase tracking-widest opacity-60">SteadiStock Version 2.4-STABLE</span>
            <span className="w-1 h-1 bg-gray-200 rounded-full" />
            <span className="text-[10px] text-neutral-secondary font-bold uppercase tracking-widest opacity-60">© 2026 SteadiStock Systems</span>
         </div>
      </div>
    </div>
  );
};
