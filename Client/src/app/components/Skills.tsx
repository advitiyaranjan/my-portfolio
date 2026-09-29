import { Braces, Layers, BrainCircuit, Database, Cpu, Server, LayoutTemplate, Wrench, Sparkles } from 'lucide-react';
import { skillAPI } from '@/utils/api';
import { useApiList } from './hooks/useApiList';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

interface Skill {
  name: string;
  proficiency?: string;
}

interface SkillCategory {
  _id?: string;
  category: string;
  skills?: Skill[];
}

const categoryIcon = (category: string) => {
  const name = category.toLowerCase();
  if (name.includes('language')) return Braces;
  if (name.includes('framework') || name.includes('librar')) return Layers;
  if (name.includes('ai') || name.includes('ml') || name.includes('emerging')) return BrainCircuit;
  if (name.includes('data') || name.includes('cloud')) return Database;
  if (name.includes('fundamental') || name.includes('core')) return Cpu;
  if (name.includes('backend')) return Server;
  if (name.includes('frontend')) return LayoutTemplate;
  if (name.includes('tool')) return Wrench;
  return Sparkles;
};

const LEVELS: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3, expert: 3 };

export function Skills() {
  const { items: categories, loading } = useApiList<SkillCategory>(skillAPI.getAllSkills);
  const total = categories.reduce((sum, category) => sum + (category.skills?.length || 0), 0);

  return (
    <section id="skills" className="relative py-24 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          index="02"
          eyebrow="Skills"
          title="The"
          highlight="tech stack"
          subtitle={total ? `${total} tools and concepts I work with, grouped by where they sit in the stack.` : undefined}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="panel h-48 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-muted-foreground">Skills will appear here soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category, index) => {
              const Icon = categoryIcon(category.category);
              const skills = category.skills || [];
              return (
                <Reveal key={category._id || category.category} delay={(index % 3) * 0.06}>
                  <div className="panel panel-interactive h-full p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <span className="grid place-items-center w-10 h-10 rounded-xl bg-surface-2 border border-border text-neon-cyan">
                          <Icon className="w-5 h-5" />
                        </span>
                        <h3 className="font-display text-lg font-semibold text-foreground">{category.category}</h3>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{String(skills.length).padStart(2, '0')}</span>
                    </div>

                    <ul className="flex flex-wrap gap-2">
                      {skills.map((skill) => {
                        const level = skill.proficiency ? LEVELS[skill.proficiency] : 0;
                        return (
                          <li key={skill.name} className="chip" title={skill.proficiency ? `${skill.name} · ${skill.proficiency}` : skill.name}>
                            {skill.name}
                            {level > 0 && (
                              <span className="flex gap-[2px]" aria-label={skill.proficiency}>
                                {[1, 2, 3].map((bar) => (
                                  <span
                                    key={bar}
                                    className={`w-[3px] h-2.5 rounded-full ${bar <= level ? 'bg-neon-violet' : 'bg-surface-3'}`}
                                  />
                                ))}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
