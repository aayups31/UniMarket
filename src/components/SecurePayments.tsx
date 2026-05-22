import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  QrCode,
  Camera,
  CheckCircle,
  ShieldCheck,
  Lock,
  Wallet } from
'lucide-react';
export function SecurePayments() {
  return (
    <section id="safety" className="py-32 px-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Left Text */}
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
            
            Security
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
            className="text-4xl md:text-6xl mb-6 leading-tight">
            
            Premium security, <br />
            only if you want it.
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
            className="text-lg text-uw-gray mb-10 leading-relaxed">
            
            Choose in-app escrow for end-to-end QR + photo verification on every
            handover, or stick with classic cash meetups. Both are welcome.
          </motion.p>

          <motion.ul
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
              delay: 0.3
            }}
            className="space-y-6 mb-8">
            
            <li className="flex items-start gap-4">
              <div className="mt-1 bg-uw-elevated p-1.5 rounded-md border border-white/10 shadow-inner">
                <QrCode className="w-5 h-5 text-uw-gold" />
              </div>
              <span className="text-gray-300 leading-relaxed">
                <strong className="text-white">QR Verification:</strong> When
                using escrow, scan the seller's unique code to prove you met in
                person.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 bg-uw-elevated p-1.5 rounded-md border border-white/10 shadow-inner">
                <Camera className="w-5 h-5 text-uw-gold" />
              </div>
              <span className="text-gray-300 leading-relaxed">
                <strong className="text-white">Photo Evidence:</strong> A
                timestamped photo of the item serves as your receipt and
                protects both parties.
              </span>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 bg-uw-elevated p-1.5 rounded-md border border-white/10 shadow-inner">
                <Wallet className="w-5 h-5 text-gray-500" />
              </div>
              <span className="text-gray-400 leading-relaxed">
                Direct cash transactions skip these steps entirely and are
                always free.
              </span>
            </li>
          </motion.ul>
        </div>

        {/* Right Visual */}
        <motion.div
          initial={{
            opacity: 0,
            x: 20
          }}
          whileInView={{
            opacity: 1,
            x: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.7
          }}
          className="relative">
          
          <div className="absolute -top-4 left-8 bg-uw-elevated border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-uw-gold shadow-lg flex items-center gap-2 z-20">
            <Lock className="w-3 h-3" /> In-app escrow flow
          </div>

          <div className="relative bg-uw-card p-10 pt-12 rounded-3xl border border-white/[0.05] border-t-white/10 shadow-3d overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>

            {/* Ambient glow behind step 2 */}
            <div className="absolute top-1/2 left-12 -translate-y-1/2 w-[150px] h-[150px] bg-uw-gold/15 rounded-full blur-[60px] pointer-events-none"></div>

            <div className="absolute top-0 left-12 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent -z-10"></div>

            <div className="space-y-12 relative z-10">
              {/* Step 1 */}
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-uw-elevated border border-white/10 text-white rounded-full flex items-center justify-center shrink-0 shadow-inner">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2 font-sans text-white">
                    1. Pay in app
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Funds are securely held by UniMarket.
                  </p>
                  <div className="bg-uw-elevated p-4 rounded-xl border border-white/5 flex justify-between items-center shadow-inner">
                    <span className="text-sm font-medium text-gray-300">
                      Payment authorized
                    </span>
                    <span className="text-sm font-mono text-white">$45.00</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-uw-gold text-uw-black rounded-full flex items-center justify-center shrink-0 shadow-glow-strong">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2 font-sans text-white">
                    2. Scan & Snap
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Meet up, scan the seller's QR code, and snap a quick photo
                    of the item.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-uw-elevated border border-white/10 text-white rounded-full flex items-center justify-center shrink-0 shadow-inner">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2 font-sans text-white">
                    3. Funds release
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Once verified, the seller gets paid instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <Wallet className="w-4 h-4" /> Prefer cash? Skip these steps
              entirely.
            </p>
          </div>
        </motion.div>
      </div>
    </section>);

}