import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import FlowingSaree from '../components/landing/FlowingSaree';
import FeatureSection from '../components/landing/FeatureSection';

const LandingPage: React.FC = () => {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <Hero id="home" />
      <FlowingSaree id="about" />
      <FeatureSection id="features" />
      <Footer id="contact" />
    </div>
  );
};

export default LandingPage;