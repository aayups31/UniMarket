import React from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { WhyBetter } from './components/WhyBetter';
import { HowItWorks } from './components/HowItWorks';
import { Categories } from './components/Categories';
import { SecurePayments } from './components/SecurePayments';
import { Universities } from './components/Universities';
import { Testimonials } from './components/Testimonials';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
export function App() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <WhyBetter />
        <HowItWorks />
        <Categories />
        <SecurePayments />
        <Universities />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>);

}