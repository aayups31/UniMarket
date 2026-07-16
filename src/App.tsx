import { Categories } from './components/Categories';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Nav } from './components/Nav';
import { WhyBetter } from './components/WhyBetter';

export function App() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-um-canvas text-um-text-strong">
      <a className="um-skip-link" href="#main-content">
        Skip to main content
      </a>
      <Nav />
      <main className="flex-1" id="main-content">
        <Hero />
        <WhyBetter />
        <HowItWorks />
        <Categories />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
