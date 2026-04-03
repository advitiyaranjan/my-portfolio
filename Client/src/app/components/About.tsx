import { motion } from 'motion/react';
import { useInView } from './hooks/useInView';
import { Code2, Lightbulb, Users, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { portfolioAPI } from '@/utils/api';
import { AnimatedBackground } from './AnimatedBackground';

export function About() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await portfolioAPI.getPortfolio();
      setPortfolio(data.data);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    {
      Icon: Code2,
      title: 'Full Stack Developer',
      description: 'Expert in React, Node.js, Next.js, and MongoDB for building scalable applications',
    },
    {
      Icon: Lightbulb,
      title: 'Blockchain & Web3',
      description: 'Proficient in Solidity smart contracts, Web3.js, and decentralized solutions',
    },
    {
      Icon: Users,
      title: 'AI & Machine Learning',
      description: 'Applied experience with TensorFlow, scikit-learn, and OpenAI APIs',
    },
    {
      Icon: Target,
      title: 'Innovative Problem Solver',
      description: 'Building cutting-edge solutions for governance, finance, and verification systems',
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-950 relative overflow-hidden" ref={ref}>
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
              Full Stack Developer & Blockchain Enthusiast
            </h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              ) : (
                <>
                  <p>{portfolio?.bio || 'Full Stack Developer with expertise in modern web technologies.'}</p>
                  <div className="whitespace-pre-line">
                    {portfolio?.aboutDescription || 'I\'ve successfully worked on diverse projects from governance technologies with the Government of India\'s Viksit Bharat initiative to blockchain-based voting systems and AI-powered finance trackers. My focus is on creating scalable, secure, and user-centric solutions that combine cutting-edge technology with practical utility.\n\nWith GATE 2026 qualification (AIR 3460) and active involvement in leadership initiatives like SOUL Bihar & Jharkhand, I\'m committed to continuous learning and making a meaningful impact through technology and innovation.'}
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Glass Card with Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: `${portfolio?.stats?.projectsCompleted || 50}+`, label: 'Projects Completed' },
                  { number: `${portfolio?.stats?.yearsExperience || 5}+`, label: 'Years Experience' },
                  { number: `${portfolio?.stats?.usersImpacted || 100}K+`, label: 'Users Impacted' },
                  { number: `${portfolio?.stats?.technologiesCount || 15}+`, label: 'Technologies' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl"
                  >
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Highlights Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              className="group p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <item.Icon className="w-6 h-6 text-white" />
              </motion.div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
