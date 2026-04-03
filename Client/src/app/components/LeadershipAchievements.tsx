import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Award, Target, Users, Zap, ExternalLink } from 'lucide-react';
import { achievementAPI } from '../../utils/api';
import { AnimatedBackground } from './AnimatedBackground';

interface Achievement {
  _id: string;
  icon: 'Award' | 'Target' | 'Users' | 'Zap';
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  gradient: string;
  color: string;
  order: number;
  link?: string;
}

const iconMap = {
  Award,
  Target,
  Users,
  Zap,
};

export function LeadershipAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🎯 LeadershipAchievements render - state:', { loading, error, count: achievements.length });

  useEffect(() => {
    console.log('🎯 LeadershipAchievements component mounted');
    
    const loadAchievements = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching achievements...');
        const response = await achievementAPI.getAllAchievements();
        console.log('✅ API Response:', response);
        
        const data = response.data || response;
        const achievementsArray = Array.isArray(data) ? data : (Array.isArray(response) ? response : []);
        
        console.log('📊 Loaded achievements:', achievementsArray.length);
        setAchievements(achievementsArray);
        setError(null);
      } catch (err) {
        console.error('❌ Error loading achievements:', err);
        setError(String(err));
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  // LOADING STATE
  if (loading) {
    console.log('Rendering LOADING');
    return (
      <section id="achievements" className="py-20 bg-gray-950 relative overflow-hidden">
        <AnimatedBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-xl font-bold text-gray-600">⏳ Loading achievements...</p>
        </div>
      </section>
    );
  }

  // ERROR STATE
  if (error) {
    console.log('Rendering ERROR:', error);
    return (
      <section id="achievements" className="py-20 bg-gray-950 relative overflow-hidden">
        <AnimatedBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-xl font-bold text-red-600">❌ {error}</p>
        </div>
      </section>
    );
  }

  // EMPTY STATE
  if (!achievements || achievements.length === 0) {
    console.log('Rendering EMPTY');
    return (
      <section id="achievements" className="py-20 bg-gray-950 relative overflow-hidden">
        <AnimatedBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-xl font-bold text-gray-600">📭 No achievements found</p>
        </div>
      </section>
    );
  }

  // SUCCESS STATE
  console.log('Rendering SUCCESS with', achievements.length, 'achievements');

  return (
    <section id="achievements" className="py-20 bg-gray-950 relative overflow-hidden">
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Leadership & Achievements
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Recognition of excellence, leadership impact, and contributions to innovation and social development
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {achievements.map((achievement, index) => {
            const IconComponent = iconMap[achievement.icon];
            return (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: false, amount: 0.3 }}
              >
                <a
                  href={achievement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block h-full ${achievement.link ? 'cursor-pointer' : ''}`}
                >
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700 h-full hover:scale-105">
                    <div className={`h-1 bg-gradient-to-r ${achievement.gradient}`} />

                    <div className="p-8">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${achievement.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                          {IconComponent ? (
                            <IconComponent className="w-7 h-7 text-white" />
                          ) : (
                            <span className="text-white text-lg">★</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                              {achievement.title}
                            </h3>
                            {achievement.link && (
                              <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                            {achievement.subtitle}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                        {achievement.description}
                      </p>

                      <div className="space-y-2">
                        {achievement.details && achievement.details.map((detail, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${achievement.gradient}`} />
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                              {detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Commitment to Excellence
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            These achievements represent a dedication to continuous learning, leadership development, and making a positive impact through technology and innovation. From academic excellence to national recognition and regional leadership, committed to driving meaningful change and fostering a culture of collaboration and social responsibility.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
