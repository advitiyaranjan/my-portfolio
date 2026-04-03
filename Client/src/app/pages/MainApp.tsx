import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { Experience } from '../components/Experience';
import { LeadershipAchievements } from '../components/LeadershipAchievements';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { ScrollToTop } from '../components/ScrollToTop';

interface MainAppProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function MainApp({ theme, toggleTheme }: MainAppProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <LeadershipAchievements />
        <Contact />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
