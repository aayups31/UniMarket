import React from 'react';
import { motion } from 'framer-motion';
const steps = [
{
  num: '01',
  title: 'Verify your status',
  desc: "Sign up with your @uwaterloo.ca email address. We'll send a quick verification link to ensure you're a real student."
},
{
  num: '02',
  title: 'Browse your campus',
  desc: 'Find what you need from peers right on campus. Everything from textbooks to mini-fridges, just a short walk away.'
},
{
  num: '03',
  title: 'Pay securely & meet',
  desc: 'Use our in-app escrow to pay safely, or agree to meet up for cash. Meet at the library or student center.'
}];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
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
            className="text-xs font-mono uppercase tracking-widest text-uw-gold/70 mb-6">
            
            Process
          </motion.div>
          <motion.h2
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
            transition={{
              delay: 0.1
            }}
            className="text-4xl md:text-6xl">
            
            How it works
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-0"></div>

          {/* Ambient glow behind middle step */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-uw-gold/10 rounded-full blur-[80px] pointer-events-none"></div>

          {steps.map((step, index) =>
          <motion.div
            key={index}
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
            transition={{
              delay: index * 0.2
            }}
            className="relative z-10 flex flex-col items-center text-center group">
            
              <div className="w-16 h-16 bg-uw-card border border-white/[0.05] border-t-white/20 rounded-full flex items-center justify-center text-xl font-mono text-uw-gold mb-8 shadow-3d relative overflow-hidden group-hover:shadow-glow transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>
                <span className="relative z-10">{step.num}</span>
              </div>
              <h3 className="font-bold text-2xl mb-4 font-sans text-white">
                {step.title}
              </h3>
              <p className="text-gray-400 max-w-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}