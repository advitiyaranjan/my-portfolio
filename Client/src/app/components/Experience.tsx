import { Briefcase, CalendarDays, MapPin, ArrowUpRight } from 'lucide-react';
import { experienceAPI } from '@/utils/api';
import { useApiList } from './hooks/useApiList';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { accentFor } from './Projects';
import { externalUrl } from '../lib/url';

interface ExperienceItem {
  _id?: string;
  title: string;
  company: string;
  type?: string;
  location?: string;
  description?: string;
  startDate: string;
  endDate?: string | null;
  isCurrentRole?: boolean;
  technologies?: string[];
  credentialUrl?: string;
  credentialLabel?: string;
  gradient?: string;
}

const formatMonth = (date?: string | null) => {
  if (!date) return '';
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const formatPeriod = (exp: ExperienceItem) => {
  const start = formatMonth(exp.startDate);
  if (exp.isCurrentRole || !exp.endDate) return `${start} – Present`;
  const end = formatMonth(exp.endDate);
  return start === end ? start : `${start} – ${end}`;
};

export function Experience() {
  const { items: experiences, loading } = useApiList<ExperienceItem>(experienceAPI.getAllExperience);

  return (
    <section id="experience" className="relative py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          index="04"
          eyebrow="Experience"
          title="Where I've"
          highlight="worked"
          subtitle="Roles, internships and programs that shaped how I build."
        />

        {loading ? (
          <div className="space-y-5">
            {[0, 1].map((i) => (
              <div key={i} className="panel h-44 animate-pulse" />
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <p className="text-muted-foreground">Experience will appear here soon.</p>
        ) : (
          <ol className="relative">
            {/* Timeline rail */}
            <span
              aria-hidden="true"
              className="absolute left-[19px] sm:left-[23px] top-2 bottom-2 w-px"
              style={{ backgroundImage: 'linear-gradient(to bottom, var(--neon-cyan), var(--neon-violet), transparent)' }}
            />

            {experiences.map((exp, index) => {
              const [from, to] = accentFor(exp.gradient);
              const points = (exp.description || '').split('\n').map((p) => p.trim()).filter(Boolean);

              return (
                <li key={exp._id || `${exp.company}-${exp.title}`} className="relative pl-14 sm:pl-20 pb-8 last:pb-0">
                  <span
                    className="absolute left-0 top-5 grid place-items-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl text-white shadow-lg"
                    style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: `0 8px 24px -8px ${from}` }}
                  >
                    <Briefcase className="w-5 h-5" />
                  </span>

                  <Reveal delay={index * 0.05}>
                    <article className="panel panel-interactive p-6 sm:p-7">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {exp.isCurrentRole && (
                          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/25">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Current
                          </span>
                        )}
                        {exp.type && <span className="chip font-mono text-[11px] uppercase tracking-wider">{exp.type}</span>}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6">
                        <div>
                          <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-foreground">{exp.title}</h3>
                          <p className="mt-1.5 flex items-center gap-2 font-medium text-foreground/80">
                            <span className="w-4 h-[2px] rounded-full" style={{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }} />
                            {exp.company}
                          </p>
                        </div>
                        <div className="sm:text-right shrink-0 space-y-1 font-mono text-xs text-muted-foreground">
                          <p className="flex sm:justify-end items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {formatPeriod(exp)}
                          </p>
                          {exp.location && (
                            <p className="flex sm:justify-end items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {exp.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {points.length > 0 && (
                        <ul className="mt-5 space-y-2.5">
                          {points.map((point) => (
                            <li key={point} className="flex gap-3 text-sm sm:text-[0.95rem] leading-relaxed text-muted-foreground">
                              <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full" style={{ backgroundColor: from }} />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {((exp.technologies && exp.technologies.length > 0) || exp.credentialUrl) && (
                        <div className="mt-5 flex flex-wrap items-center gap-1.5">
                          {exp.technologies?.map((tech) => (
                            <span key={tech} className="chip font-mono text-[11px]">
                              {tech}
                            </span>
                          ))}
                          {exp.credentialUrl && (
                            <a
                              href={externalUrl(exp.credentialUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-neon-violet hover:underline underline-offset-4"
                            >
                              {exp.credentialLabel || 'Credential'}
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      )}
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
