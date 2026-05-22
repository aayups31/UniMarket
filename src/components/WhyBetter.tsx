import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Map, GraduationCap, Lock } from 'lucide-react';
const pillars = [
{
  icon: <Shield className="w-6 h-6" />,
  title: 'Verified Students Only',
  description:
  'Every user is verified with an active university email. No bots, no scammers, just real peers.'
},
{
  icon: <Map className="w-6 h-6" />,
  title: 'Hyper-Local',
  description:
  'See listings only from your campus or within a 5km radius. Meetups are always a short walk away.'
},
{
  icon: <GraduationCap className="w-6 h-6" />,
  title: 'Student-Focused',
  description:
  'Categories built for student life: textbooks, dorm gear, sublets, and event tickets.'
},
{
  icon: <Lock className="w-6 h-6" />,
  title: 'Secure Payments',
  description:
  'Optional in-app escrow with QR verification. We hold the money until you get the item.'
}];

export function WhyBetter() {
  return (
    <section className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-uw-gold/10 rounded-full blur-[120px] pointer-events-none"></div>

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
            
            Why Us
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
            className="text-4xl md:text-6xl mb-6 relative z-10">
            
            Why students choose UniMarket
          </motion.h2>
          <motion.p
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
              delay: 0.2
            }}
            className="text-uw-gray text-lg relative z-10">
            
            Designed around how students actually live, buy, and sell. A
            premium, safe, and tailored experience for your campus.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) =>
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
              delay: index * 0.1
            }}
            className="p-8 rounded-2xl bg-uw-card border border-white/[0.05] border-t-white/10 shadow-3d hover:border-white/15 hover:border-t-white/20 transition-all group relative overflow-hidden">
            
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-uw-elevated border border-white/10 rounded-xl flex items-center justify-center text-uw-gold mb-8 group-hover:bg-uw-gold/10 group-hover:border-uw-gold/30 transition-colors shadow-inner">
                  {pillar.icon}
                </div>
                <h3 className="font-bold text-xl mb-3 font-sans text-white">
                  {pillar.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}