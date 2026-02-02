import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Armchair } from 'lucide-react';
import { Hero } from '../components/Hero';
import { DonationForm } from '../components/DonationForm';
import { Scoreboard } from '../components/Scoreboard';
import { ProgressBar } from '../components/ProgressBar';
import { QRCodeSection } from '../components/QRCodeSection';
import { getStoredData, getFormattedCurrency } from '../services/storage';
import { AppState } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AppState | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const donateSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial data
    setData(getStoredData());

    // Polling simulation for "live" updates
    const interval = setInterval(() => {
      setData(getStoredData());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const scrollToDonate = () => {
    donateSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDonationSuccess = () => {
    navigate('/success');
  };

  if (!data) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  
  // Calculate distinct count of verified donors
  const verifiedCount = data.donations.filter(d => d.status === 'verified').length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark:bg-slate-950' : 'bg-slate-50'}`}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
            Yaaron Ka <span className="text-brand-600 ml-1">Kaafila</span>
          </span>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <Hero onDonateClick={scrollToDonate} />

        <div className="max-w-5xl mx-auto px-4 pb-20 space-y-16">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transform -translate-y-4">
            <div className="text-center border-r border-slate-100 dark:border-slate-800">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">Studio Fund</div>
              <div className="text-2xl md:text-3xl font-extrabold text-brand-600">{getFormattedCurrency(data.totalCollected)}</div>
            </div>
            <div className="text-center md:border-r border-slate-100 dark:border-slate-800">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">Legends Joined</div>
              <div className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{verifiedCount}</div>
            </div>
            <div className="text-center col-span-2 md:col-span-1 mt-4 md:mt-0">
               <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">Renovation Goal</div>
               <div className="font-bold text-xl text-slate-900 dark:text-white">
                 {Math.round((data.totalCollected / data.goalAmount) * 100)}% Complete
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div ref={donateSectionRef}>
              <div className="flex items-center gap-2 mb-6">
                <Armchair className="w-6 h-6 text-brand-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Fuel the Renovation</h2>
              </div>
              <DonationForm onSuccess={handleDonationSuccess} />
            </div>

            <div>
               <ProgressBar current={data.totalCollected} target={data.goalAmount} />
               <Scoreboard donations={data.donations} />
            </div>
          </div>
        </div>
      </main>

      <QRCodeSection />
      
      <footer className="bg-slate-900 text-white py-12 text-center text-sm">
        <div className="max-w-md mx-auto px-6">
            <p className="font-semibold text-lg mb-2">Yaaron Ka Kaafila</p>
            <p className="opacity-60 mb-6">Building memories, one brick (and bean bag) at a time.</p>
            <p className="opacity-40 text-xs">&copy; {new Date().getFullYear()} Studio Renovation Committee.</p>
        </div>
      </footer>
    </div>
  );
};