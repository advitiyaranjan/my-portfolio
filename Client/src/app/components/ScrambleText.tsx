import { useCallback, useEffect, useRef, useState } from 'react';

const GLYPHS = '<>/\\{}[]=+*#%01ΞΛΣΔ_';

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** Start when scrolled into view (default) or right after mount. */
  trigger?: 'view' | 'mount';
  delay?: number;
  replayOnHover?: boolean;
}

/** Text that "decrypts" from random glyphs into the real words. Screen readers get the plain text. */
export function ScrambleText({ text, className, trigger = 'view', delay = 0, replayOnHover }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const timers = useRef<{ interval?: number; timeout?: number }>({});

  const run = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.clearInterval(timers.current.interval);
    const start = performance.now();
    const duration = 550 + text.length * 30;
    timers.current.interval = window.setInterval(() => {
      const progress = (performance.now() - start) / duration;
      if (progress >= 1) {
        window.clearInterval(timers.current.interval);
        setDisplay(text);
        return;
      }
      const revealed = Math.floor(progress * text.length);
      setDisplay(
        text
          .split('')
          .map((ch, i) => (ch === ' ' || i < revealed ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join('')
      );
    }, 40);
  }, [text]);

  useEffect(() => {
    setDisplay(text);
    const el = ref.current;
    let observer: IntersectionObserver | undefined;
    const schedule = () => {
      timers.current.timeout = window.setTimeout(run, delay);
    };
    if (trigger === 'mount') {
      schedule();
    } else if (el) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer?.disconnect();
            schedule();
          }
        },
        { threshold: 0.6 }
      );
      observer.observe(el);
    }
    const t = timers.current;
    return () => {
      observer?.disconnect();
      window.clearTimeout(t.timeout);
      window.clearInterval(t.interval);
    };
  }, [text, trigger, delay, run]);

  return (
    <span ref={ref} className={className} onMouseEnter={replayOnHover ? run : undefined}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
