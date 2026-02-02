import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Smartphone, ShieldCheck, Loader2, PartyPopper } from 'lucide-react';
import { Card } from './ui/Card';
import { createPendingDonation, verifyTransaction } from '../services/storage';

// UPDATED CONFIG
const MERCHANT_VPA = '9319123446@yespop'; 
const MERCHANT_NAME = 'Yaaron Ka Kaafila';

interface DonationFormProps {
  onSuccess: () => void;
}

export const DonationForm: React.FC<DonationFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState<string>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success'>('idle');
  const [currentTxnId, setCurrentTxnId] = useState<string>('');

  // Suggested amounts
  const presetAmounts = [1000, 2000, 5000, 10000];

  const generateTransactionId = () => {
    return 'YKK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();
  };

  const handleDonateClick = () => {
    if (!amount || parseInt(amount) < 1) return;
    
    // 1. Lock details and create transaction ID
    const txnId = generateTransactionId();
    setCurrentTxnId(txnId);

    // 2. Create Pending Record in "Backend"
    createPendingDonation({
      transactionId: txnId,
      donorName: isAnonymous ? 'Anonymous' : (name || 'Yaar'),
      amount: parseInt(amount),
      message: message,
      isAnonymous: isAnonymous
    });

    // 3. Move to Payment Screen
    setStep(2);
  };

  const handleVerifyPayment = async () => {
    setStatus('verifying');
    
    // Simulate Backend Verification Logic
    // In production: await fetch('/api/verify', { method: 'POST', body: JSON.stringify({ txnId: currentTxnId }) })
    const isVerified = await verifyTransaction(currentTxnId);

    if (isVerified) {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else {
      alert("Verification failed. Did you complete the payment?");
      setStatus('idle');
    }
  };

  // Generate UPI Intent Link
  const upiLink = `upi://pay?pa=${MERCHANT_VPA}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${amount}&tr=${currentTxnId}&cu=INR&tn=${encodeURIComponent('Studio Fund - Yaaron Ka Kaafila')}`;

  return (
    <Card className="max-w-xl mx-auto relative overflow-hidden border-2 border-brand-100 dark:border-slate-700">
       {/* Trust Badge */}
       <div className="absolute top-0 right-0 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs px-3 py-1 rounded-bl-xl flex items-center gap-1 font-bold">
        <Lock className="w-3 h-3" /> Secure Gateway
      </div>

      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Drop some coin! 💰</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Pick an amount to help build our dream studio.</p>
              
              {/* Preset Amounts */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className={`py-3 px-1 rounded-xl text-sm font-bold transition-all transform hover:scale-105 active:scale-95 ${
                      amount === preset.toString()
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-600'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>

              {/* Amount Input */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-bold text-lg">₹</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Or enter custom amount"
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-2xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                  min="1"
                />
              </div>

              {/* Details Inputs */}
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name (Who's the legend?)"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 dark:text-white font-medium"
                />
                
                <div className="flex gap-2">
                   <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone (Optional)"
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a fun message for the scoreboard..."
                  rows={2}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 dark:text-white resize-none"
                />
                
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                        type="checkbox" 
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-brand-600 checked:bg-brand-600 focus:ring-2 focus:ring-brand-500/20"
                    />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" height="12" width="12" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    </div>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Stay mysterious (Anonymous) 🕵️</span>
                </label>
              </div>

              <button
                onClick={handleDonateClick}
                disabled={!amount}
                className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl shadow-lg transition-all flex items-center justify-center group transform active:scale-95"
              >
                Let's Go! 🚀
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center relative"
            >
              {status === 'verifying' && (
                <div className="absolute inset-0 bg-white/95 dark:bg-slate-800/95 z-10 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
                  <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Verifying...</h3>
                  <p className="text-slate-500 text-sm mt-2">Checking with the bank, hold tight!</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Confirm & Pay</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Scan QR to complete your contribution
                </p>
              </div>

              {/* Amount Display - Locked */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Locked Amount</span>
                <span className="text-2xl font-bold text-brand-600">₹{amount}</span>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block mb-6 shadow-sm">
                <QRCodeSVG value={upiLink} size={180} level="H" includeMargin />
              </div>

              <div className="text-xs text-slate-400 mb-4 font-mono break-all px-4">
                Ref: {currentTxnId}
              </div>

              <div className="space-y-3">
                <a 
                  href={upiLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl font-bold flex items-center justify-center transition-all shadow-md"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Open UPI App
                </a>
                
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Already paid?</span>
                  </div>
                </div>

                <button
                  onClick={handleVerifyPayment}
                  disabled={status !== 'idle'}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center hover:bg-green-700 transition-all shadow-lg shadow-green-500/20"
                >
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Yes, I've Paid
                </button>
                
                <button
                  onClick={() => setStep(1)}
                  disabled={status !== 'idle'}
                  className="text-sm text-red-500 hover:text-red-700 mt-4 underline"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};