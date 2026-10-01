import { ArrowUpRight, Github } from 'lucide-react';
import { projectAPI } from '@/utils/api';
import { useApiList } from './hooks/useApiList';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { externalUrl } from '../lib/url';

interface Project {
  _id?: string;
  title: string;
  description: string;
  highlights?: string[];
  techStack?: string[];
  githubLink?: string;
  liveLink?: string;
  gradient?: string;
}

// Accent colours for the gradient keys stored with each project.
export const ACCENTS: Record<string, [string, string]> = {
  'from-blue-500 to-cyan-500': ['#0ea5e9', '#06b6d4'],
  'from-purple-500 to-pink-500': ['#a855f7', '#ec4899'],
  'from-green-500 to-emerald-500': ['#22c55e', '#10b981'],
  'from-yellow-500 to-orange-500': ['#eab308', '#f97316'],
  'from-red-500 to-rose-500': ['#ef4444', '#f43f5e'],
  'from-indigo-500 to-blue-500': ['#6366f1', '#3b82f6'],
  'from-orange-500 to-red-500': ['#f97316', '#ef4444'],
  'from-teal-500 to-blue-500': ['#14b8a6', '#3b82f6'],
};

export const accentFor = (gradient?: string) => ACCENTS[gradient || ''] || ['#22d3ee', '#8b5cf6'];

// Placeholder links from older data should not render as real buttons.
const isRealLink = (url?: string) => Boolean(url && !url.includes('example.com') && url !== '#');

export function Projects() {
  const { items: projects, loading } = useApiList<Project>(projectAPI.getAllProjects);

  return (
    <section id="projects" className="relative py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          index="03"
          eyebrow="Projects"
          title="Things I've"
          highlight="built"
          subtitle="Selected work across full-stack products, machine learning and optimisation."
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[0, 1].map((i) => (
              <div key={i} className="panel h-72 animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="text-muted-foreground">Projects will appear here soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project, index) => {
              const [from, to] = accentFor(project.gradient);
              const live = isRealLink(project.liveLink) ? externalUrl(project.liveLink) : undefined;
              const github = isRealLink(project.githubLink) ? externalUrl(project.githubLink) : undefined;
              const tech = project.techStack || [];

              return (
                <Reveal key={project._id || project.title} delay={(index % 2) * 0.08} className="h-full">
                  <article className="panel panel-interactive group h-full flex flex-col overflow-hidden">
                    <div className="h-[3px] w-full" style={{ backgroundImage: `linear-gradient(90deg, ${from}, ${to})` }} />
                    <div
                      className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle, ${from}33, transparent 65%)` }}
                    />

                    <div className="relative flex flex-col flex-1 p-6 sm:p-7">
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-mono text-xs text-muted-foreground">P-{String(index + 1).padStart(2, '0')}</span>
                        {live && (
                          <a
                            href={live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-btn w-9 h-9"
                            aria-label={`Open ${project.title}`}
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">{project.title}</h3>
                      <p className="mt-3 text-sm sm:text-[0.95rem] leading-relaxed text-muted-foreground">{project.description}</p>

                      {project.highlights && project.highlights.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {project.highlights.map((point) => (
                            <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                              <span
                                className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full"
                                style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
                              />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-auto pt-6">
                        <ul className="flex flex-wrap gap-1.5">
                          {tech.map((item) => (
                            <li key={item} className="chip font-mono text-[11px]">
                              {item}
                            </li>
                          ))}
                        </ul>

                        {(github || live) && (
                          <div className="mt-5 flex flex-wrap gap-2.5">
                            {live && (
                              <a href={live} target="_blank" rel="noopener noreferrer" className="btn btn-primary py-2.5 px-4 text-sm">
                                Live demo
                                <ArrowUpRight className="w-4 h-4" />
                              </a>
                            )}
                            {github && (
                              <a href={github} target="_blank" rel="noopener noreferrer" className="btn btn-outline py-2.5 px-4 text-sm">
                                <Github className="w-4 h-4" />
                                Source
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
