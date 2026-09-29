import { Github, Linkedin, Twitter, Mail, Code2 } from 'lucide-react';
import { usePortfolio } from './hooks/usePortfolio';

const QUICK_LINKS = [
  { label: 'About', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'Certifications', id: 'certifications' },
  { label: 'Contact', id: 'contact' },
];

export function Footer() {
  const { portfolio } = usePortfolio();
  const { socialLinks } = portfolio;

  const socials = [
    { Icon: Github, href: socialLinks.github, label: 'GitHub' },
    { Icon: Linkedin, href: socialLinks.linkedin, label: 'LinkedIn' },
    { Icon: Code2, href: socialLinks.leetcode, label: 'LeetCode' },
    { Icon: Twitter, href: socialLinks.twitter, label: 'X (Twitter)' },
    { Icon: Mail, href: portfolio.email ? `mailto:${portfolio.email}` : undefined, label: 'Email' },
  ].filter((social) => social.href);

  return (
    <footer className="relative z-10 border-t border-border bg-surface/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid place-items-center w-9 h-9 rounded-xl neon-border font-display font-bold text-sm">
                <span className="text-gradient">AR</span>
              </span>
              <span className="font-display text-lg font-semibold text-foreground">{portfolio.fullName}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{portfolio.title}</p>
            <div className="mt-5 flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href?.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="icon-btn w-9 h-9"
                  aria-label={label}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="hud-label mb-4">Navigate</p>
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5">
              {QUICK_LINKS.map(({ label, id }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {portfolio.fullName}. All rights reserved.</p>
          <p>Built with React · TypeScript · Tailwind</p>
        </div>
      </div>
    </footer>
  );
}
