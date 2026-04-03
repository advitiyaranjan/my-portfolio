import { motion } from 'motion/react';
import { useInView } from './hooks/useInView';
import { Briefcase, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { experienceAPI } from '@/utils/api';
import { AnimatedBackground } from './AnimatedBackground';

export function Experience() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const response = await experienceAPI.getAllExperience();
      const expsData = response?.data || [];
      
      // Map API response to component structure
      const mapped = expsData.map((exp: any) => ({
        ...exp,
        role: exp.title, // API returns 'title', component uses 'role'
        period: exp.endDate 
          ? `${new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - ${new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`
          : `${new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - Present`,
        description: exp.description ? [exp.description] : [], // Convert string to array
        type: 'Engineering', // Default type
        gradient: exp.gradient || 'from-blue-500 to-cyan-500', // Use API gradient or default
        color: exp.color || 'blue' // Use API color or default
      }));
      
      setExperiences(mapped);
      console.log('Experiences loaded:', mapped);
    } catch (error) {
      console.error('Failed to load experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-gray-950 relative overflow-hidden" ref={ref}>
        <AnimatedBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-gray-500 dark:text-gray-400">
          Loading experiences...
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-gray-950 relative overflow-hidden" ref={ref}>
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Experience
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From government blockchain initiatives to innovative full-stack development
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp._id || exp.company + exp.role}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col`}
              >
                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <motion.div
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Type Badge */}
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                      exp.gradient === 'from-purple-500 to-pink-500'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                        : exp.gradient === 'from-green-500 to-emerald-500'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : exp.gradient === 'from-orange-500 to-red-500'
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                        : exp.gradient === 'from-indigo-500 to-blue-500'
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : exp.gradient === 'from-teal-500 to-blue-500'
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    }`}>
                      {exp.type}
                    </div>

                    {/* Company Name */}
                    <p className={`text-sm font-semibold mb-1 ${
                      exp.gradient === 'from-purple-500 to-pink-500' ? 'text-purple-600 dark:text-purple-400' :
                      exp.gradient === 'from-green-500 to-emerald-500' ? 'text-green-600 dark:text-green-400' :
                      exp.gradient === 'from-orange-500 to-red-500' ? 'text-orange-600 dark:text-orange-400' :
                      exp.gradient === 'from-indigo-500 to-blue-500' ? 'text-indigo-600 dark:text-indigo-400' :
                      exp.gradient === 'from-teal-500 to-blue-500' ? 'text-teal-600 dark:text-teal-400' :
                      'text-blue-600 dark:text-blue-400'
                    }`}>
                      {exp.company}
                    </p>

                    {/* Role & Title */}
                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                      {exp.role}
                    </h3>

                    {/* Period */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">{exp.period}</span>
                    </div>

                    {/* Description */}
                    <div className="space-y-3 text-sm leading-relaxed">
                      {exp.description.map((item, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 bg-gradient-to-r ${exp.gradient}`} />
                          <p className="text-gray-700 dark:text-gray-300">{item}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Center Icon */}
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center">
                  <motion.div
                    className={`w-12 h-12 bg-gradient-to-br ${exp.gradient} rounded-full flex items-center justify-center shadow-lg z-10`}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                  >
                    <Briefcase className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
