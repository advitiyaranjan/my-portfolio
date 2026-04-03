import { motion } from 'motion/react';
import { useInView } from './hooks/useInView';
import { ExternalLink, Github } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectAPI } from '@/utils/api';
import { AnimatedBackground } from './AnimatedBackground';

// Gradient mapping for consistent colors
const gradientMap: { [key: string]: { from: string; to: string; button: string } } = {
  'from-blue-500 to-cyan-500': {
    from: '#0ea5e9',
    to: '#06b6d4',
    button: 'from-blue-500 to-cyan-500'
  },
  'from-purple-500 to-pink-500': {
    from: '#a855f7',
    to: '#ec4899',
    button: 'from-purple-500 to-pink-500'
  },
  'from-green-500 to-emerald-500': {
    from: '#22c55e',
    to: '#10b981',
    button: 'from-green-500 to-emerald-500'
  },
  'from-yellow-500 to-orange-500': {
    from: '#eab308',
    to: '#f97316',
    button: 'from-yellow-500 to-orange-500'
  },
  'from-red-500 to-rose-500': {
    from: '#ef4444',
    to: '#f43f5e',
    button: 'from-red-500 to-rose-500'
  },
  'from-indigo-500 to-blue-500': {
    from: '#6366f1',
    to: '#3b82f6',
    button: 'from-indigo-500 to-blue-500'
  }
};

export function Projects() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectAPI.getAllProjects();
      setProjects(response?.data || []);
      console.log('Projects loaded:', response?.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradientStyle = (gradient?: string) => {
    if (!gradient) return {};
    const colors = gradientMap[gradient];
    if (!colors) return {};
    return {
      backgroundImage: `linear-gradient(to right, ${colors.from}, ${colors.to})`
    };
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gray-950 relative overflow-hidden" ref={ref}>
        <AnimatedBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-gray-500 dark:text-gray-400">
          Loading projects...
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-gray-950 relative overflow-hidden" ref={ref}>
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A selection of projects showcasing technical excellence and product thinking
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project._id || project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group h-full"
            >
              <div className="h-full bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col hover:border-gray-300 dark:hover:border-gray-600">
                {/* Gradient Header - Using inline style for reliable gradient rendering */}
                <div 
                  className="h-3" 
                  style={getGradientStyle(project.gradient)}
                />

                <div className="p-6 flex flex-col flex-1">
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-5 pb-4 border-b border-gray-200 dark:border-gray-700">
                    {(project.techStack || []).slice(0, 4).map((tech: string) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {(project.techStack || []).length > 4 && (
                      <span className="px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400">
                        +{(project.techStack || []).length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Links Section - Uniform 2-button layout */}
                  <div className="flex gap-3 flex-wrap">
                    {/* Live Demo Button - Always rendered with gradient */}
                    <motion.a
                      href={project.liveLink || '#'}
                      target={project.liveLink ? '_blank' : undefined}
                      rel={project.liveLink ? 'noopener noreferrer' : undefined}
                      className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm group/btn ${
                        !project.liveLink ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      style={project.liveLink ? {
                        ...getGradientStyle(project.gradient),
                        backgroundSize: '100% 100%'
                      } : {
                        backgroundImage: 'linear-gradient(to right, #3b82f6, #1e40af)',
                        opacity: 0.6
                      }}
                      whileHover={project.liveLink ? { scale: 1.05 } : {}}
                      whileTap={project.liveLink ? { scale: 0.95 } : {}}
                      onClick={(e) => {
                        if (!project.liveLink) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Demo</span>
                    </motion.a>

                    {/* GitHub Button - Always rendered */}
                    <motion.a
                      href={project.githubLink || '#'}
                      target={project.githubLink ? '_blank' : undefined}
                      rel={project.githubLink ? 'noopener noreferrer' : undefined}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm group/btn ${
                        !project.githubLink ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      style={project.githubLink ? {
                        backgroundImage: 'linear-gradient(to right, #1f2937, #111827)'
                      } : {
                        backgroundImage: 'linear-gradient(to right, #1f2937, #111827)',
                        opacity: 0.6
                      }}
                      whileHover={project.githubLink ? { scale: 1.05 } : {}}
                      whileTap={project.githubLink ? { scale: 0.95 } : {}}
                      onClick={(e) => {
                        if (!project.githubLink) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Github className="w-4 h-4" />
                      <span className="hidden sm:inline">GitHub</span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
