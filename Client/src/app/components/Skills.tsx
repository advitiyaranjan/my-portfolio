import { motion } from 'motion/react';
import { useInView } from './hooks/useInView';
import { useState, useEffect } from 'react';
import { skillAPI } from '@/utils/api';
import { AnimatedBackground } from './AnimatedBackground';

export function Skills() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const response = await skillAPI.getAllSkills();
      const skillsData = response?.data || [];
      
      // Flatten the nested skills structure
      const flattenedSkills = skillsData.flatMap((category: any) => 
        category.skills?.map((skill: any) => ({
          ...skill,
          // Convert proficiency strings to numbers
          proficiency: skill.proficiency === 'expert' ? 95 : 
                      skill.proficiency === 'advanced' ? 80 : 
                      skill.proficiency === 'intermediate' ? 60 : 40,
          level: skill.proficiency === 'expert' ? 95 : 
                 skill.proficiency === 'advanced' ? 80 : 
                 skill.proficiency === 'intermediate' ? 60 : 40
        })) || []
      );
      
      setSkillsData(flattenedSkills);
      console.log('Skills loaded:', flattenedSkills);
    } catch (error) {
      console.error('Failed to load skills:', error);
      setSkillsData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-gray-950 relative overflow-hidden" ref={ref}>
        <AnimatedBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-gray-500 dark:text-gray-400">
          Loading skills...
        </div>
      </section>
    );
  }

  const SkillCard = ({ skill, index }: { skill: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {skill.name}
        </span>
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {skill.proficiency || skill.level || '80'}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.proficiency || skill.level || 80}%` } : {}}
          transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        />
      </div>
    </motion.div>
  );

  return (
    <section id="skills" className="py-20 bg-gray-950 relative overflow-hidden" ref={ref}>
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Professional skills and expertise across multiple domains
          </p>
        </motion.div>

        {skillsData.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 h-full border border-blue-200 dark:border-blue-800">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
                  Technical Skills
                </h3>

                <div className="space-y-6">
                  {skillsData.slice(0, Math.ceil(skillsData.length / 2)).map((skill, index) => (
                    <SkillCard key={skill.name} skill={skill} index={index} />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 h-full border border-purple-200 dark:border-purple-800">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">
                  Additional Skills
                </h3>

                <div className="space-y-6">
                  {skillsData.slice(Math.ceil(skillsData.length / 2)).map((skill, index) => (
                    <SkillCard key={skill.name} skill={skill} index={index} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No skills data available
          </div>
        )}
      </div>
    </section>
  );
}
