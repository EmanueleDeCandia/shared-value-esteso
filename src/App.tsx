import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { Proof, Comparison, CoreLogic } from './components/SectionsTop';
import { DualTrack, Partners, Benchmark } from './components/SectionsMid';
import Simulator from './components/simulator/Simulator';
import { Indicators, Impact, Infrastructure, Roadmap, Testimonials, FAQ, CTA, Footer } from './components/SectionsBottom';

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-cream antialiased">
      <a href="#simulatore" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-cream focus:px-4 focus:py-2 focus:text-ink">
        Vai al simulatore
      </a>
      <Navbar />
      <main>
        <Hero />
        <Proof />
        <Comparison />
        <CoreLogic />
        <DualTrack />
        <Partners />
        <Benchmark />
        <Simulator />
        <Indicators />
        <Impact />
        <Infrastructure />
        <Roadmap />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
