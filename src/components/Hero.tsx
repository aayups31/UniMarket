import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
export function Hero() {
  return (
    <section className="pt-32 pb-24 px-6 overflow-hidden relative">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-uw-gold/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-uw-gold/10 rounded-full blur-[120px] pointer-events-none hidden lg:block"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="max-w-2xl">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-uw-card border border-white/[0.05] border-t-white/10 rounded-full text-sm font-medium mb-8 shadow-3d relative overflow-hidden">
            
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>
            <ShieldCheck className="w-4 h-4 text-uw-gold relative z-10" />
            <span className="text-gray-300 relative z-10">
              Verified student sellers only
            </span>
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: 0.1
            }}
            className="text-6xl md:text-8xl leading-[1.05] mb-6">
            
            The marketplace built for{' '}
            <span className="bg-gradient-to-r from-white via-[#FFF0B3] to-uw-gold bg-clip-text text-transparent">
              students
            </span>
            , not strangers.
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: 0.2
            }}
            className="text-lg text-uw-gray mb-10 max-w-lg leading-relaxed">
            
            Buy and sell safely with peers from your campus. No spam, no sketchy
            meetups, just verified students within 5km of your university.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5,
              delay: 0.3
            }}
            className="flex flex-col sm:flex-row gap-4">
            
            <a href="#waitlist" className="bg-uw-gold text-uw-black px-6 py-3.5 rounded-xl font-bold hover:bg-[#E5BC00] transition-all flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-strong shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
              Join with @uwaterloo.ca
              <ArrowRight className="w-4 h-4" />
            </a>
            <button className="bg-uw-card border border-white/[0.05] border-t-white/10 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white/5 hover:border-uw-gold/50 hover:text-uw-gold transition-all flex items-center justify-center shadow-3d relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>
              <span className="relative z-10">Browse listings</span>
            </button>
          </motion.div>
        </div>

        {/* Right Visual - Floating Cards */}
        <div className="relative h-[500px] hidden lg:block">
          {/* Card 1 */}
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
              rotate: -5
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: -2
            }}
            transition={{
              duration: 0.7,
              delay: 0.4,
              type: 'spring'
            }}
            className="absolute top-10 left-10 w-72 bg-uw-card p-4 rounded-2xl shadow-3d border border-white/[0.05] border-t-white/10 z-10 overflow-hidden">
            
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <div className="h-40 bg-uw-elevated rounded-xl mb-4 overflow-hidden relative border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#111] to-[#222]"></div>
                <div className="absolute inset-x-8 inset-y-4 bg-[#2A2A2A] shadow-sm rounded-md border border-white/10 flex items-center justify-center">
                  <span className="font-serif text-gray-500 text-xl">
                    Calculus
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg leading-tight text-white">
                    Calculus Early Transcendentals
                  </h3>
                  <p className="text-sm text-gray-400">
                    8th Edition • Like New
                  </p>
                </div>
                <span className="font-bold text-xl text-white">$45</span>
              </div>
              <div className="mt-4 inline-flex items-center gap-1.5 bg-uw-gold/10 border border-uw-gold/20 text-uw-gold text-xs px-2.5 py-1 rounded-full font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified • UWaterloo
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
              rotate: 5
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: 3
            }}
            transition={{
              duration: 0.7,
              delay: 0.6,
              type: 'spring'
            }}
            className="absolute bottom-10 right-10 w-64 bg-uw-card p-4 rounded-2xl shadow-3d border border-white/[0.05] border-t-white/10 z-20 overflow-hidden">
            
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <div className="h-32 bg-uw-elevated rounded-xl mb-4 overflow-hidden relative border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#111] to-[#222]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-16 bg-gray-700"></div>
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-16 h-8 bg-gray-600 rounded-t-full"></div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg leading-tight text-white">
                    IKEA Desk Lamp
                  </h3>
                  <p className="text-sm text-gray-400">Works perfectly</p>
                </div>
                <span className="font-bold text-xl text-white">$15</span>
              </div>
              <div className="mt-4 inline-flex items-center gap-1.5 bg-uw-gold/10 border border-uw-gold/20 text-uw-gold text-xs px-2.5 py-1 rounded-full font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified • UWaterloo
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}
