import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

export const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-neutral-text flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <motion.div 
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 0.95, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: "easeInOut"
          }}
          className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-primary/40 relative z-10"
        >
          <ShieldCheck size={48} />
        </motion.div>
        
        {/* Decorative rings */}
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-primary/20 rounded-[32px] -z-0"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 text-center"
      >
        <h1 className="text-4xl font-black text-white italic tracking-tighter">SteadiStock</h1>
        <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mt-2">Initializing Integrity...</p>
      </motion.div>

      <motion.div 
        className="absolute bottom-12 w-48 h-1 bg-white/10 rounded-full overflow-hidden"
      >
        <motion.div 
           animate={{ x: [-192, 192] }}
           transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
           className="w-full h-full bg-primary shadow-[0_0_15px_rgba(255,140,0,0.8)]"
        />
      </motion.div>
    </div>
  );
};
