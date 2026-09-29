import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../theme';

// Defined outside the component so the section observer below is set up once, not on every render.
const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Skills', id: 'skills' },
  { label: 'Projects', id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'Achievements', id: 'achievements' },
  { label: 'Certifications', id: 'certifications' },
  { label: 'Contact', id: 'contact' },
];

const hasAdminToken = () => {
  try {
    return Boolean(localStorage.getItem('authToken') || localStorage.getItem('portfolioToken'));
  } catch {
    return false;
  }
};

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(e)}
      className={`icon-btn ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
    </button>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(hasAdminToken);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onStorage = () => setIsAdmin(hasAdminToken());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id || 'home');
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    NAV_ITEMS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 inset-x-0 z-50 px-3 sm:px-4 pt-3"
    >
      <nav
        className={`mx-auto max-w-6xl rounded-2xl transition-[background-color,box-shadow,border-color] duration-300 ${
          isScrolled || isMobileMenuOpen ? 'glass shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]' : 'border border-transparent'
        }`}
        aria-label="Primary"
      >
        <div className="flex items-center justify-between h-14 pl-3 pr-2 sm:pl-4">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="group flex items-center gap-2.5"
          >
            <span className="grid place-items-center w-9 h-9 rounded-xl neon-border font-display font-bold text-sm">
              <span className="text-gradient">AR</span>
            </span>
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-display font-semibold text-foreground">Advitiya Ranjan</span>
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground mt-1">portfolio.v2</span>
            </span>
          </a>

          {/* Desktop navigation */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map(({ label, id }) => {
              const isActive = activeSection === id;
              return (
                <li key={id} className="relative">
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(id);
                    }}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative z-10 block px-3 py-2 text-[13px] font-medium rounded-lg transition-colors ${
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {label}
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-surface-2 border border-border"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    >
                      <span className="absolute left-1/2 -translate-x-1/2 -bottom-px h-px w-6 bg-gradient-to-r from-neon-cyan to-neon-violet" />
                    </motion.span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <a href="/admin/dashboard" className="icon-btn" title="Admin dashboard" aria-label="Admin dashboard">
                <LayoutDashboard className="w-[18px] h-[18px]" />
              </a>
            )}
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="icon-btn lg:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence initial={false}>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden px-2 pb-2"
            >
              <ul className="grid grid-cols-2 gap-1 pt-1 border-t border-border">
                {NAV_ITEMS.map(({ label, id }) => {
                  const isActive = activeSection === id;
                  return (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(id);
                        }}
                        className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-surface-2 text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
