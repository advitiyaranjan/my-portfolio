import { motion } from 'motion/react';
import { useInView } from './hooks/useInView';
import { ExternalLink, BarChart3, Lightbulb, CheckCircle, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { caseStudyAPI } from '@/utils/api';

export function CaseStudies() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCaseStudies();
  }, []);

  const loadCaseStudies = async () => {
    try {
      const data = await caseStudyAPI.getAllCaseStudies();
      setCaseStudies(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Failed to load case studies:', error);
      setCaseStudies([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="case-studies" className="py-20 bg-gray-50 dark:bg-gray-800/50" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  if (caseStudies.length === 0) {
    return (
      <section id="case-studies" className="py-20 bg-gray-50 dark:bg-gray-800/50" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Case Studies
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-4">No case studies available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="case-studies" className="py-20 bg-gray-50 dark:bg-gray-800/50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Case Studies
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Real-world problems solved through product thinking and technical execution
          </p>
        </motion.div>

        <div className="space-y-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study._id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="bg-white dark:bg-gray-900/80 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Top Gradient Border */}
                <div className="h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600"></div>

                {/* Content */}
                <div className="p-8 lg:p-10">
                  {/* Header */}
                  <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                    {study.title}
                  </h3>
                  
                  {study.description && (
                    <p className="text-blue-600 dark:text-blue-400 font-semibold mb-8">
                      {study.description}
                    </p>
                  )}

                  {/* 2x2 Grid of Sections */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Problem */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Problem</h4>
                      </div>
                      {study.challenge && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {study.challenge}
                        </p>
                      )}
                    </div>

                    {/* Solution */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Lightbulb className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Solution</h4>
                      </div>
                      {study.solution && (
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {study.solution}
                        </p>
                      )}
                    </div>

                    {/* Approach */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Approach</h4>
                      </div>
                      {study.solution && (
                        <ul className="space-y-2">
                          {study.solution.split('\n').slice(0, 2).map((item: string, i: number) => (
                            <li key={i} className="text-gray-600 dark:text-gray-300 text-sm flex items-start gap-2">
                              <span className="text-blue-500 mt-1">›</span>
                              <span>{item.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Impact Section - Full Width */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">Impact</h4>
                    </div>
                    {study.results && (
                      <div className="grid grid-cols-2 gap-4">
                        {study.results.split('|').map((result: string, i: number) => (
                          <div key={i} className="bg-gradient-to-br from-gray-700/30 to-gray-800/40 dark:from-gray-800/50 dark:to-gray-900/50 border border-purple-500/30 dark:border-purple-500/40 rounded-lg p-5 hover:border-purple-500/60 transition-all hover:shadow-lg">
                            <p className="text-purple-300 dark:text-purple-200 text-sm font-semibold leading-relaxed">
                              {result.trim()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Technologies & Link */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex items-center justify-between">
                    {study.technologies && study.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {study.technologies.map((tech: string) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {study.link && (
                      <motion.a
                        href={study.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </motion.a>
                    )}
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
