import { Code2, Lightbulb, Users, Target, GraduationCap } from 'lucide-react';
import { usePortfolio } from './hooks/usePortfolio';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

const highlightIcons = {
  Code: Code2,
  Lightbulb,
  Users,
  Target,
} as const;

const DEFAULT_HIGHLIGHTS = [
  {
    icon: 'Code',
    title: 'Full Stack Engineering',
    description: 'React, Next.js, Node.js, Express and TypeScript, from REST APIs and MongoDB schemas to deployed, responsive interfaces.',
  },
  {
    icon: 'Lightbulb',
    title: 'AI & Machine Learning',
    description: 'PyTorch, TensorFlow and scikit-learn for deep learning, computer vision and practical ML features.',
  },
  {
    icon: 'Users',
    title: 'Community & Leadership',
    description: 'Google Student Ambassador, Chairman of the IIITM Hindi Club and Social Media Head at Rotaract.',
  },
  {
    icon: 'Target',
    title: 'Problem Solver',
    description: 'GATE 2026 AIR 3460 and 500+ DSA problems solved across LeetCode, Codeforces and GeeksforGeeks.',
  },
];

export function About() {
  const { portfolio, loading } = usePortfolio();

  const highlights = portfolio.aboutHighlights?.length ? portfolio.aboutHighlights : DEFAULT_HIGHLIGHTS;
  const paragraphs = (portfolio.aboutDescription || portfolio.bio).split(/\n\s*\n/).filter(Boolean);
  const stats = portfolio.stats || {};
  const statItems = [
    { value: `${stats.projectsCompleted ?? 7}+`, label: 'Projects shipped' },
    { value: `${stats.yearsExperience ?? 1}+`, label: 'Years building' },
    { value: `${stats.usersImpacted ?? 1}K+`, label: 'People reached' },
    { value: `${stats.technologiesCount ?? 30}+`, label: 'Technologies' },
  ];
  const education = portfolio.education;

  return (
    <section id="about" className="relative py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading index="01" eyebrow="About" title="Engineering meets" highlight="product thinking" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Reveal className="lg:col-span-3">
            <div className="panel h-full p-7 sm:p-9">
              <p className="hud-label mb-5">// profile.md</p>
              {loading ? (
                <div className="space-y-3 animate-pulse">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-4 rounded bg-surface-3" style={{ width: `${95 - i * 12}%` }} />
                  ))}
                </div>
              ) : (
                <div className="space-y-5 text-[1.02rem] leading-relaxed text-muted-foreground">
                  {paragraphs.map((paragraph, i) => (
                    <p key={i} className={i === 0 ? 'text-foreground' : undefined}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          <div className="lg:col-span-2 grid gap-6">
            {education && (
              <Reveal delay={0.1}>
                <div className="panel hud-frame p-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 grid place-items-center w-11 h-11 rounded-xl bg-surface-2 border border-border text-neon-cyan">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="hud-label">Education · {education.period}</p>
                      <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-foreground">
                        {education.degree}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{education.institution}</p>
                      {education.cgpa && (
                        <p className="mt-3 inline-flex items-baseline gap-2 font-mono text-xs text-muted-foreground">
                          CGPA <span className="font-display text-base font-bold text-foreground">{education.cgpa}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            <Reveal delay={0.18}>
              <div className="grid grid-cols-2 gap-3">
                {statItems.map((stat) => (
                  <div key={stat.label} className="panel p-5">
                    <p className="font-display text-3xl font-bold text-gradient">{stat.value}</p>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item, index) => {
            const Icon = highlightIcons[item.icon as keyof typeof highlightIcons] || Code2;
            return (
              <Reveal key={`${item.title}-${index}`} delay={index * 0.06}>
                <div className="panel panel-interactive h-full p-6">
                  <div className="grid place-items-center w-11 h-11 rounded-xl neon-border mb-5">
                    <Icon className="w-5 h-5 text-neon-violet" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
