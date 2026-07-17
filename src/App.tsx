import { Categories } from './components/Categories';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Nav } from './components/Nav';
import { WhyBetter } from './components/WhyBetter';

export function App() {
  return (
    <div className="um-marketing-page relative isolate min-h-screen w-full text-um-text-strong">
      <div aria-hidden="true" className="um-marketing-ambient">
        <span className="um-marketing-ambient__field um-marketing-ambient__field--primary" />
        <span className="um-marketing-ambient__field um-marketing-ambient__field--secondary" />
        <span className="um-marketing-ambient__field um-marketing-ambient__field--tertiary" />
      </div>
      <a className="um-skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="relative z-10 flex min-h-screen w-full flex-col">
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
    </div>
  );
}
