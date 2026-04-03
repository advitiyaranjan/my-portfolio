import { motion } from 'motion/react';
import { ArrowRight, Github, Linkedin, Mail, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { portfolioAPI } from '@/utils/api';
import { AnimatedBackground } from './AnimatedBackground';

export function Hero() {
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
      // Use default values if API fails
      setPortfolio({
        fullName: 'Advitiya Ranjan',
        title: 'Full Stack Developer & Blockchain Engineer',
        bio: 'Building innovative solutions with React, Node.js, and Blockchain...',
        profileImage: '/images/profile.jpg',
        resumeLink: '',
        socialLinks: {
          github: 'https://github.com/advitiyaranjan',
          linkedin: 'https://www.linkedin.com/in/advitiya-ranjan',
          email_link: 'mailto:advityaranjan1@gmail.com',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </section>
    );
  }

  const socialLinks = [
    { Icon: Github, href: portfolio?.socialLinks?.github || 'https://github.com', label: 'GitHub' },
    { Icon: Linkedin, href: portfolio?.socialLinks?.linkedin || 'https://linkedin.com', label: 'LinkedIn' },
    { Icon: Mail, href: portfolio?.socialLinks?.email_link || 'mailto:hello@example.com', label: 'Email' },
  ];

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 bg-gray-950">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-20 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 px-4 sm:px-0">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mb-6"
            >
              👋 Welcome to my portfolio
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4 leading-tight"
            >
              <span className="block text-gray-700 dark:text-gray-300 mb-2">
                Hi, I'm
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-[1.2]">
                {portfolio?.fullName}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-400 mb-6"
            >
              {portfolio?.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              {portfolio?.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <motion.button
                onClick={() => scrollToSection('#projects')}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.a
                href={portfolio?.resumeLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!portfolio?.resumeLink) {
                    e.preventDefault();
                    scrollToSection('#contact');
                  }
                }}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={portfolio?.resumeLink ? 'View Resume' : 'Resume link will be added soon'}
              >
                View Resume
                <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </motion.a>

              <motion.button
                onClick={() => scrollToSection('#contact')}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-medium border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4 justify-center lg:justify-start"
            >
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-2">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                  {/* Profile image */}
                  <img 
                    src={portfolio?.profileImage || '/images/profile.jpg'} 
                    alt="Profile" 
                    className="w-full h-full object-cover object-top rounded-full"
                  />
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <span className="text-2xl">🚀</span>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
                animate={{ rotate: [0, -5, 0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              >
                <span className="text-2xl">⚡</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
