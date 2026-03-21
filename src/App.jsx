import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/sections/Hero';
import FeaturesStrip from './components/sections/FeaturesStrip';
import CopyTrading from './components/sections/CopyTrading';
import ActionSection from './components/sections/ActionSection';
import ExperienceGrid from './components/sections/ExperienceGrid';
import TradeAnywhere from './components/sections/TradeAnywhere';
import EverythingSection from './components/sections/EverythingSection';

function App() {
  return (
    <div className="app-wrapper" style={{background: '#fff'}}>
      <Navbar />
      
      <main>
        <Hero />
        <FeaturesStrip />
        <CopyTrading />
        <ActionSection />
        <ExperienceGrid />
        <TradeAnywhere />
        <EverythingSection />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
