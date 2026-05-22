import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
export function FinalCTA() {
  return (
    <section className="py-32 px-6 relative">
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
              Join thousands of students buying and selling safely on campus.
              Sign up now with your university email.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-uw-gold text-uw-black px-8 py-4 rounded-xl font-bold hover:bg-[#E5BC00] transition-all flex items-center justify-center gap-2 text-lg shadow-glow hover:shadow-glow-strong shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                Sign up with @uwaterloo.ca
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}