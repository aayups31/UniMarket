import React from 'react';
import { motion } from 'framer-motion';
const quotes = [
{
  text: "I don't have to worry about sketchy meetups because everyone is literally a student here. Sold my old monitor in 2 hours.",
  author: 'Aanya P.',
  role: '3rd Year, Computer Science',
  uni: 'University of Waterloo'
},
{
  text: "The escrow payment is a game changer. I bought a bike and didn't have to pull out $150 in cash. Met at the SLC, scanned the QR, done.",
  author: 'Marcus T.',
  role: '2nd Year, Engineering',
  uni: 'University of Waterloo'
},
{
  text: 'Finally a place where I can find textbooks that are actually for my specific courses. Found my exact Calc book from someone in my dorm building.',
  author: 'Sarah L.',
  role: '1st Year, Science',
  uni: 'University of Waterloo'
}];

export function Testimonials() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
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
            
            Community
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
            className="text-4xl md:text-6xl">
            
            Trusted by Waterloo students
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {quotes.map((quote, index) =>
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
            className="bg-uw-card p-10 rounded-3xl border border-white/[0.05] border-t-white/10 shadow-3d flex flex-col justify-between relative overflow-hidden group">
            
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-uw-gold/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <p className="text-lg text-gray-300 leading-relaxed mb-10 font-serif italic">
                  "{quote.text}"
                </p>
                <div>
                  <p className="font-bold font-sans text-white">
                    {quote.author}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">{quote.role}</p>
                  <div className="inline-block px-2.5 py-1 bg-uw-elevated border border-white/10 text-gray-300 text-xs font-semibold rounded-md shadow-inner">
                    {quote.uni}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}