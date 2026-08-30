import React, { useState } from 'react';
import { Bell, Mail, X, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { saveSubscriberToFirestore, SubscriberRecord } from '../services/firestoreService';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeSuccess: (email: string) => void;
  siteLogo?: string;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  onSubscribeSuccess,
  siteLogo
}) => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    const trimmedEmail = email.trim();
    const newSub: SubscriberRecord = {
      id: `sub-${Date.now()}`,
      email: trimmedEmail,
      category: 'All Job Updates',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    // 1. Save directly to Firebase Firestore Cloud Database
    try {
      await saveSubscriberToFirestore(newSub);
    } catch (err) {
      console.warn('Firebase subscriber save error:', err);
    }

    // 2. Save to Express server API
    try {
      await fetch('/api/v1/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, category: 'All Job Updates' })
      });
    } catch (err) {
      console.warn('Server subscriber save error:', err);
    }

    // 3. Save to localStorage list of subscribers
    try {
      const existing = JSON.parse(localStorage.getItem('fastarc_subscribers') || '[]');
      if (!existing.includes(trimmedEmail)) {
        existing.push(trimmedEmail);
        localStorage.setItem('fastarc_subscribers', JSON.stringify(existing));
      }
    } catch (err) {
      console.error(err);
    }

    setIsSuccess(true);
    onSubscribeSuccess(trimmedEmail);

    setTimeout(() => {
      setIsSuccess(false);
      setEmail('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 transition-colors">
        
        {/* Top Official India Tricolor Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-white to-emerald-600" />

        {/* Header Govt Navy Bar */}
        <div className="bg-slate-50 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 p-5 text-slate-900 dark:text-white flex items-center justify-between transition-colors">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full p-0.5 bg-black border-2 border-amber-500 shadow-md flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src={siteLogo || "/logo.png"} 
                alt="FastArc Logo" 
                className="w-full h-full object-cover scale-125 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/d/1IE6MQ8EUwyKmGeXnpLTXx7d5HBLJiKb4";
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight leading-none text-slate-900 dark:text-white flex items-center">
                Fast<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400">Arc</span>
              </h3>
              <p className="text-[9px] text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-widest mt-0.5">Govt Jobs Portal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border border-slate-300 dark:border-slate-700"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3 animate-in fade-in">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">Subscribed Successfully!</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                <span className="font-bold text-amber-600 dark:text-amber-400">{email}</span> has been added. You will now get instant email alerts whenever a new job post is published on <strong className="text-slate-900 dark:text-white">FastArc Govt Jobs Portal</strong>!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Never Miss Any Government Job Alert
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enter your email address below to receive instant notification emails as soon as new job posts, admit cards, or exam results are published.
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Zero spam. Unsubscribe anytime with 1 click.</span>
              </div>

              <button
                type="submit"
                disabled={!email}
                className="w-full bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 hover:from-blue-800 hover:to-indigo-800 border border-amber-500/40 active:scale-98 disabled:opacity-50 text-amber-300 font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-blue-950/60 transition-all cursor-pointer flex items-center justify-center space-x-2 mt-2"
              >
                <Bell className="w-4 h-4 fill-current text-amber-400" />
                <span>Subscribe</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
