import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock } from 'lucide-react';
const unis = [
{
  name: 'University of Waterloo',
  status: 'live'
},
{
  name: 'Wilfrid Laurier University',
  status: 'soon'
},
{
  name: 'McMaster University',
  status: 'soon'
},
{
  name: 'Western University',
  status: 'soon'
},
{
  name: 'University of Toronto',
  status: 'soon'
},
{
  name: 'University of Guelph',
  status: 'soon'
},
{
  name: 'Toronto Metropolitan',
  status: 'soon'
}];

export function Universities() {
  return (
    <section id="universities" className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="max-w-4xl mx-auto text-center">
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
          
          Campuses
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
          className="text-4xl md:text-6xl mb-6">
          
          Coming to your campus
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
            delay: 0.1
          }}
          className="text-uw-gray text-lg mb-16 max-w-2xl mx-auto">
          
          We're starting at the University of Waterloo, but expanding rapidly
          across Ontario. See if your school is next on the list.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-3 mb-20">
          {unis.map((uni, index) =>
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            whileInView={{
              opacity: 1,
              scale: 1
            }}
            viewport={{
              once: true
            }}
            transition={{
              delay: index * 0.05
            }}
            className="relative">
            
              {uni.status === 'live' &&
            <div className="absolute inset-0 bg-uw-gold/20 blur-md rounded-full pointer-events-none"></div>
            }
              <div
              className={`relative px-5 py-2.5 rounded-full border flex items-center gap-2 text-sm font-medium transition-colors ${uni.status === 'live' ? 'bg-uw-gold/10 text-uw-gold border-uw-gold/30 shadow-glow' : 'bg-uw-elevated border-white/10 text-gray-400 shadow-inner'}`}>
              
                {uni.status === 'live' ?
              <CheckCircle2 className="w-4 h-4" /> :

              <Clock className="w-4 h-4 opacity-50" />
              }
                {uni.name}
              </div>
            </motion.div>
          )}
        </div>

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
          transition={{
            delay: 0.4
          }}
          className="bg-uw-card border border-white/[0.05] border-t-white/10 p-10 rounded-3xl max-w-lg mx-auto shadow-3d relative overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="font-bold text-2xl mb-3 font-sans text-white">
              Don't see your university?
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              Request it and we'll prioritize campuses with the most demand.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => e.preventDefault()}>
              
              <input
                type="email"
                placeholder="Enter your school email"
                className="flex-1 bg-uw-elevated border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-uw-gold transition-colors shadow-inner" />
              
              <button className="bg-white text-uw-black px-8 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-lg">
                Request
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>);

}