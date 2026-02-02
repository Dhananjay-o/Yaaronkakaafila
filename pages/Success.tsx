import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Heart, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Success: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Fire confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#0ea5e9', '#f59e0b', '#ec4899']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0ea5e9', '#f59e0b', '#ec4899']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100 dark:border-slate-700"
      >
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <PartyPopper className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">You're a Legend! 🌟</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
          Thanks for chipping in! The studio is gonna look <span className="font-bold text-brand-600">epic</span> because of you.
        </p>

        <div className="space-y-3">
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold flex items-center justify-center shadow-lg shadow-brand-500/30 transition-all"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Kaafila
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
            <p className="flex items-center justify-center text-sm text-slate-400">
                Crafted with <Heart className="w-3 h-3 mx-1 text-red-500 fill-current" /> for the squad
            </p>
        </div>
      </motion.div>
    </div>
  );
};