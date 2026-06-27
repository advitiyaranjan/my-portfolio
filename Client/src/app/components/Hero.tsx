import { motion } from 'motion/react';
import { ArrowRight, ArrowDown, FileText, Github, Linkedin, Mail, Code2, Twitter } from 'lucide-react';
import { useEffect } from 'react';
import { portfolioAPI } from '@/utils/api';
import { usePortfolio } from './hooks/usePortfolio';
import { ScrambleText } from './ScrambleText';
import { externalUrl } from '../lib/url';

const PORTFOLIO_VIEW_SESSION_KEY = 'portfolioViewTracked';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: 'easeOut' as const },
});

export function Hero() {
  const { portfolio } = usePortfolio();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(PORTFOLIO_VIEW_SESSION_KEY)) return;
    } catch {
      return;
    }
    portfolioAPI
      .incrementView()
      .then(() => {
        try {
          sessionStorage.setItem(PORTFOLIO_VIEW_SESSION_KEY, 'true');
        } catch {
          /* ignore */
        }
      })
      .catch(() => {});
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const nameParts = portfolio.fullName.trim().split(' ');
  const lastName = nameParts.length > 1 ? nameParts.pop() : '';
  const firstNames = nameParts.join(' ');

  const { socialLinks } = portfolio;
  const socials = [
    { Icon: Github, href: socialLinks.github, label: 'GitHub' },
    { Icon: Linkedin, href: socialLinks.linkedin, label: 'LinkedIn' },
    { Icon: Code2, href: socialLinks.leetcode, label: 'LeetCode' },
    { Icon: Twitter, href: socialLinks.twitter, label: 'X (Twitter)' },
    { Icon: Mail, href: portfolio.email ? `mailto:${portfolio.email}` : socialLinks.email_link, label: 'Email' },
  ].filter((social) => social.href);

  const highlights = portfolio.heroHighlights ?? [];

  return (
    <section id="home" className="relative min-h-[100svh] flex items-center pt-28 pb-20 overflow-hidden">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 lg:gap-10 items-center">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <motion.div
              {...fadeUp(0.05)}
              className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/70 px-3.5 py-1.5 mb-7"
            >
              <span className="pulse-dot w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
                Open to opportunities
              </span>
            </motion.div>

            <motion.p {...fadeUp(0.12)} className="font-mono text-sm text-neon-cyan mb-3">
              &gt; hello_world, I'm
            </motion.p>

            <motion.h1
              {...fadeUp(0.18)}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-foreground"
            >
              {firstNames}{' '}
              {lastName && <ScrambleText text={lastName} className="text-gradient" trigger="mount" delay={450} replayOnHover />}
            </motion.h1>

            <motion.p {...fadeUp(0.26)} className="mt-5 font-display text-xl sm:text-2xl font-medium text-foreground/85">
              {portfolio.title}
              <span className="inline-block w-[2px] h-[1.1em] ml-1 align-[-0.15em] bg-neon-cyan animate-pulse" aria-hidden="true" />
            </motion.p>

            <motion.p
              {...fadeUp(0.34)}
              className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl mx-auto lg:mx-0"
            >
              {portfolio.bio}
            </motion.p>

            <motion.div {...fadeUp(0.42)} className="mt-9 flex flex-wrap gap-3 justify-center lg:justify-start">
              <button type="button" onClick={() => scrollTo('projects')} className="btn btn-primary group" data-magnetic>
                View projects
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              {portfolio.resumeLink && (
                <a href={externalUrl(portfolio.resumeLink)} target="_blank" rel="noopener noreferrer" className="btn btn-outline" data-magnetic>
                  <FileText className="w-4 h-4" />
                  Resume
                </a>
              )}
              <button type="button" onClick={() => scrollTo('contact')} className="btn btn-ghost">
                Contact me
              </button>
            </motion.div>

            <motion.div {...fadeUp(0.5)} className="mt-9 flex gap-2.5 justify-center lg:justify-start">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href?.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="icon-btn"
                  aria-label={label}
                  title={label}
                  data-magnetic
                >
                  <Icon className="w-[18px] h-[18px]" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="relative w-64 sm:w-80 lg:w-[22rem] aspect-square">
              <div className="absolute inset-8 rounded-full blur-3xl opacity-80" style={{ background: 'var(--glow)' }} />
              <div className="absolute -inset-5 rounded-full border border-dashed border-border-strong" />
              <div className="absolute inset-0 rounded-full holo-ring" />
              <div className="absolute inset-[3px] rounded-full bg-background" />
              <img
                src={portfolio.profileImage}
                alt={portfolio.fullName}
                width={352}
                height={352}
                className="absolute inset-[10px] w-[calc(100%-20px)] h-[calc(100%-20px)] rounded-full object-cover object-top"
              />

              {highlights.map((item, i) => (
                <div
                  key={item.label}
                  className={`hidden sm:block absolute panel bg-surface px-4 py-2.5 float-slow ${
                    ['-left-10 top-6', '-right-12 top-1/2 -translate-y-1/2', 'left-2 -bottom-6'][i % 3]
                  }`}
                  style={{ animationDelay: `${i * 1.3}s` }}
                >
                  <p className="font-display text-lg font-bold leading-none text-gradient">{item.value}</p>
                  <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted-foreground mt-1.5">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Highlights as a row on small screens */}
            <div className="sm:hidden mt-8 grid grid-cols-3 gap-2 w-full max-w-sm">
              {highlights.map((item) => (
                <div key={item.label} className="panel px-2 py-3 text-center">
                  <p className="font-display text-base font-bold text-gradient">{item.value}</p>
                  <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollTo('about')}
        className="hidden md:flex absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Scroll to About"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ArrowDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}
