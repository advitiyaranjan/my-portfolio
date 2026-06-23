import { Award, Target, Users, Zap, Code2, Megaphone, ArrowUpRight } from 'lucide-react';
import { achievementAPI } from '../../utils/api';
import { useApiList } from './hooks/useApiList';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { accentFor } from './Projects';

interface Achievement {
  _id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  details?: string[];
  gradient?: string;
  link?: string;
}

const iconMap: Record<string, typeof Award> = {
  Award,
  Target,
  Users,
  Zap,
  Code: Code2,
  Megaphone,
};

export function LeadershipAchievements() {
  const { items: achievements, loading } = useApiList<Achievement>(achievementAPI.getAllAchievements);

  return (
    <section id="achievements" className="relative py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          index="05"
          eyebrow="Leadership & Achievements"
          title="Milestones &"
          highlight="leadership"
          subtitle="Recognition for competitive exams, national-level innovation and campus leadership."
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="panel h-52 animate-pulse" />
            ))}
          </div>
        ) : achievements.length === 0 ? (
          <p className="text-muted-foreground">Achievements will appear here soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {achievements.map((achievement, index) => {
              const Icon = iconMap[achievement.icon] || Award;
              const [from, to] = accentFor(achievement.gradient);
              const content = (
                <>
                  <div className="flex items-start gap-4">
                    <span
                      className="shrink-0 grid place-items-center w-12 h-12 rounded-2xl text-white"
                      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: `0 10px 24px -12px ${from}` }}
                    >
                      <Icon className="w-6 h-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">{achievement.title}</h3>
                        {achievement.link && (
                          <ArrowUpRight className="w-5 h-5 shrink-0 text-muted-foreground transition-colors group-hover:text-neon-violet" />
                        )}
                      </div>
                      <p className="mt-0.5 font-mono text-xs uppercase tracking-wider text-neon-cyan">{achievement.subtitle}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm sm:text-[0.95rem] leading-relaxed text-muted-foreground">{achievement.description}</p>

                  {achievement.details && achievement.details.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {achievement.details.map((detail) => (
                        <li key={detail} className="chip">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              );

              return (
                <Reveal key={achievement._id || achievement.title} delay={(index % 2) * 0.08} className="h-full">
                  {achievement.link ? (
                    <a
                      href={achievement.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="panel panel-interactive group block h-full p-6 sm:p-7"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="panel panel-interactive group h-full p-6 sm:p-7">{content}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
