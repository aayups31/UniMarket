import React from 'react';
import { motion } from 'framer-motion';
export function Nav() {
  return (
    <motion.nav
      initial={{
        y: -20,
        opacity: 0
      }}
      animate={{
        y: 0,
        opacity: 1
      }}
      transition={{
        duration: 0.5
      }}
      className="fixed top-0 left-0 right-0 z-50 bg-uw-black/80 backdrop-blur-md border-b border-uw-border">
      
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-2xl font-serif font-bold tracking-tight text-white">
            
            UniMarket
          </a>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
          <a
            href="#how-it-works"
            className="text-gray-400 hover:text-white transition-colors">
            
            How it works
          </a>
          <a
            href="#categories"
            className="text-gray-400 hover:text-white transition-colors">
            
            Categories
          </a>
          <a
            href="#safety"
            className="text-gray-400 hover:text-white transition-colors">
            
            Safety
          </a>
          <a
            href="#universities"
            className="text-gray-400 hover:text-white transition-colors">
            
            Universities
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Log in
          </button>
          <button className="bg-uw-gold text-uw-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#E5BC00] transition-colors shadow-glow">
            Sign in with @uwaterloo.ca
          </button>
        </div>
      </div>
    </motion.nav>);

}
