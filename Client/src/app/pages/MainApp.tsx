import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { Experience } from '../components/Experience';
import { LeadershipAchievements } from '../components/LeadershipAchievements';
import { Certifications } from '../components/Certifications';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { ScrollToTop } from '../components/ScrollToTop';
import { Backdrop } from '../components/Backdrop';

export default function MainApp() {
  return (
    <div className="relative min-h-screen text-foreground">
      <Backdrop />
      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <LeadershipAchievements />
        <Certifications />
        <Contact />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
