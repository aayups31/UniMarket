import React, { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const WAITLIST_STORAGE_KEY = 'unimarket_waitlist_emails_v1';

export function FinalCTA() {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(WAITLIST_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as string[];
      if (!Array.isArray(parsed)) localStorage.removeItem(WAITLIST_STORAGE_KEY);
    } catch {
      localStorage.removeItem(WAITLIST_STORAGE_KEY);
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!isValidEmail) {
      setIsError(true);
      setStatusMessage('Enter a valid email to join the waitlist.');
      return;
    }

    const stored = localStorage.getItem(WAITLIST_STORAGE_KEY);
    let entries: string[] = [];
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed)) {
          entries = parsed;
        }
      } catch {
        entries = [];
      }
    }

    if (entries.includes(normalizedEmail)) {
      setIsError(false);
      setStatusMessage('You are already on the waitlist.');
      return;
    }

    const nextEntries = [...entries, normalizedEmail];
    localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(nextEntries));
    setEmail('');
    setIsError(false);
    setStatusMessage('Thanks. You are on the waitlist.');
  };

  return (
    <section className="py-32 px-6 relative" id="waitlist">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="bg-uw-card border border-white/[0.05] border-t-white/10 rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-3d">
          
          {/* 3D Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>

          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-uw-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-uw-gold/15 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl mb-8">
              Built by students, <br />
              <span className="bg-gradient-to-r from-white via-[#FFF0B3] to-uw-gold bg-clip-text text-transparent">
                for students.
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join the waitlist and help us launch on more campuses.
              We will notify early users first.
            </p>
            <form
              onSubmit={handleSubmit}
              className="max-w-2xl mx-auto flex flex-col sm:flex-row justify-center gap-4"
            >
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@uwaterloo.ca"
                className="w-full sm:flex-1 bg-uw-elevated border border-white/10 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-uw-gold/70"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="bg-uw-gold text-uw-black px-8 py-4 rounded-xl font-bold hover:bg-[#E5BC00] transition-all flex items-center justify-center gap-2 text-lg shadow-glow hover:shadow-glow-strong shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
              >
                Interested - Join waitlist
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-6 flex flex-col items-center gap-2">
              {statusMessage ? (
                <p className={`text-sm ${isError ? 'text-red-400' : 'text-emerald-400'}`}>
                  {statusMessage}
                </p>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}
