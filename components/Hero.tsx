import React from 'react';
import { motion } from 'framer-motion';
import { PaintBucket, Sparkles } from 'lucide-react';

interface HeroProps {
  onDonateClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDonateClick }) => {
  return (
    <section className="relative pt-16 pb-20 px-4 text-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-50 to-transparent dark:from-slate-900 dark:to-slate-950 -z-10" />
      
      {/* Decorative Circles */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-brand-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-20 right-10 w-24 h-24 bg-accent-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto relative"
      >
        <div className="inline-flex items-center justify-center p-2 px-4 mb-6 bg-brand-100 dark:bg-slate-800 rounded-full text-brand-700 dark:text-brand-300 text-sm font-bold shadow-sm">
          <PaintBucket className="w-4 h-4 mr-2" />
          Studio Upgrade Mode: ON 🎨
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Yaaron Ka <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500">Kaafila</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
          We're turning our shared studio into the <span className="text-brand-600 dark:text-brand-400 font-bold">ultimate creative den!</span> 🛋️✨ <br/>
          From comfy seating to epic vibes, this space belongs to all of us. Let's pool in and make it legendary!
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onDonateClick}
            className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold shadow-lg shadow-brand-500/30 transition-all transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center text-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Chip In for the Vibes
          </button>
        </div>
      </motion.div>
    </section>
  );
};