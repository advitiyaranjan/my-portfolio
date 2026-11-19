import { ArrowUpRight, Github } from 'lucide-react';
import { useApiList } from './hooks/useApiList';
import siteContent from '../../data/site-content.json';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { externalUrl } from '../lib/url';

interface Project {
  _id?: string;
  title: string;
  description: string;
  highlights?: string[];
  techStack?: string[];
  imageUrl?: string;
  imageAlt?: string;
  githubLink?: string;
  liveLink?: string;
  gradient?: string;
}

export const accentFor = (_gradient?: string) => ['#155eef', '#155eef'];

// Placeholder links from older data should not render as real buttons.
const isRealLink = (url?: string) => Boolean(url && !url.includes('example.com') && url !== '#');

export function Projects() {
  const { items: projects, loading } = useApiList<Project>(siteContent.projects);

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
              const live = isRealLink(project.liveLink) ? externalUrl(project.liveLink) : undefined;
              const github = isRealLink(project.githubLink) ? externalUrl(project.githubLink) : undefined;
              const tech = project.techStack || [];

              return (
                <Reveal key={project._id || project.title} delay={(index % 2) * 0.08} className="h-full">
                  <article className="panel panel-interactive group h-full flex flex-col overflow-hidden">
                    <div className="h-[3px] w-full bg-primary" />
                    {project.imageUrl && (
                      <img
                        src={project.imageUrl}
                        alt={project.imageAlt || `Illustrative visual for ${project.title}`}
                        width={500}
                        height={300}
                        loading="lazy"
                        decoding="async"
                        className="h-48 w-full border-b border-border object-cover"
                      />
                    )}

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
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-neon-cyan">Problem</p>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/80">{project.description}</p>
                      <p className="mt-3 text-xs font-mono uppercase tracking-wider text-muted-foreground"><span className="text-neon-cyan">Role</span> · Project creator and developer</p>

                      {project.highlights && project.highlights.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {project.highlights.map((point) => (
                            <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                              <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-primary" />
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
