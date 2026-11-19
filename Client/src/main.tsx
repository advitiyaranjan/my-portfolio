
import { createRoot, hydrateRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import Router from './Router.tsx';
import { ThemeProvider } from './app/theme';
import './styles/index.css';

const root = document.getElementById('root')!;

if (window.location.pathname === '/' && root.hasChildNodes()) {
  const hydrate = async () => {
    const { default: MainApp } = await import('./app/pages/MainApp');
    hydrateRoot(root, <ThemeProvider><MotionConfig reducedMotion="user"><MainApp /></MotionConfig></ThemeProvider>);
  };
  const idleWindow = window as Window & { requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number };
  if (idleWindow.requestIdleCallback) idleWindow.requestIdleCallback(hydrate, { timeout: 1500 });
  else window.requestAnimationFrame(() => window.requestAnimationFrame(hydrate));
} else {
  createRoot(root).render(<Router />);
}
// Updated for Vercel build
