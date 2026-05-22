import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Lamp,
  Laptop,
  Bike,
  Armchair,
  Ticket,
  Utensils,
  Shirt } from
'lucide-react';
const categories = [
{
  name: 'Textbooks',
  icon: <BookOpen className="w-6 h-6" />,
  count: '342'
},
{
  name: 'Dorm Essentials',
  icon: <Lamp className="w-6 h-6" />,
  count: '156'
},
{
  name: 'Electronics',
  icon: <Laptop className="w-6 h-6" />,
  count: '89'
},
{
  name: 'Bikes & Scooters',
  icon: <Bike className="w-6 h-6" />,
  count: '45'
},
{
  name: 'Furniture',
  icon: <Armchair className="w-6 h-6" />,
  count: '210'
},
{
  name: 'Event Tickets',
  icon: <Ticket className="w-6 h-6" />,
  count: '67'
},
{
  name: 'Kitchenware',
  icon: <Utensils className="w-6 h-6" />,
  count: '124'
},
{
  name: 'Clothing',
  icon: <Shirt className="w-6 h-6" />,
  count: '430'
}];

export function Categories() {
  return (
    <section id="categories" className="py-32 px-6 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
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
              
              Categories
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
              className="text-4xl md:text-6xl mb-4">
              
              Popular on campus
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
              className="text-uw-gray text-lg">
              
              Everything you need for the semester, sold by students who don't
              need it anymore.
            </motion.p>
          </div>
          <motion.button
            initial={{
              opacity: 0
            }}
            whileInView={{
              opacity: 1
            }}
            viewport={{
              once: true
            }}
            className="text-white font-semibold hover:text-uw-gold transition-colors whitespace-nowrap pb-2 border-b border-transparent hover:border-uw-gold">
            
            View all categories →
          </motion.button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, index) =>
          <motion.a
            href="#"
            key={index}
            initial={{
              opacity: 0,
              scale: 0.95
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
            whileHover={{
              y: -4
            }}
            className="group p-8 rounded-2xl bg-uw-card border border-white/[0.05] border-t-white/10 shadow-3d hover:border-white/15 hover:border-t-white/30 hover:shadow-glow transition-all cursor-pointer flex flex-col items-center text-center relative overflow-hidden">
            
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 bg-uw-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              <div className="relative z-10 w-14 h-14 bg-uw-elevated border border-white/10 rounded-full flex items-center justify-center text-white mb-6 group-hover:bg-uw-gold group-hover:text-uw-black group-hover:border-uw-gold transition-colors shadow-inner">
                {cat.icon}
              </div>
              <h3 className="font-bold font-sans mb-2 text-white relative z-10">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500 font-mono relative z-10">
                {cat.count} listings
              </p>
            </motion.a>
          )}
        </div>
      </div>
    </section>);

}