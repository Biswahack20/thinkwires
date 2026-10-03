import Navbar from './components/common/Navbar';
import Hero from './components/HomeComponents/Hero';
import TechStack from './components/HomeComponents/TechStack';
import About from './components/HomeComponents/About';
import Capabilities from './components/HomeComponents/Capabilities';
import Openings from './components/HomeComponents/Openings';
import Process from './components/HomeComponents/Process';
import StatsJourney from './components/HomeComponents/StatsJourney';
import Industries from './components/HomeComponents/Industries';
import Reports from './components/HomeComponents/Reports';
import CTA from './components/common/CTA';
import Footer from './components/common/Footer';

function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <TechStack />
        <About />
        <Capabilities />
        <Openings />
        <Process />
        <StatsJourney />
        <Industries />
        <Reports />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
