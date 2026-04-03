import { motion } from 'motion/react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { portfolioAPI } from '@/utils/api';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [footerData, setFooterData] = useState({
    fullName: 'Advitiya Ranjan',
    bio: 'Developer & Product Manager passionate about building impactful products through code and strategy.',
    email: 'advitiyaranjan1@gmail.com',
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    }
  });

  // Fetch portfolio data
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await portfolioAPI.getPortfolio();
        const portfolio = response?.data || response;
        
        console.log('Footer data from server:', portfolio);
        
        setFooterData({
          fullName: portfolio?.fullName || 'Advitiya Ranjan',
          bio: portfolio?.bio || 'Developer & Product Manager passionate about building impactful products through code and strategy.',
          email: portfolio?.email || 'advitiyaranjan1@gmail.com',
          socialLinks: {
            github: portfolio?.socialLinks?.github || 'https://github.com',
            linkedin: portfolio?.socialLinks?.linkedin || 'https://linkedin.com',
            twitter: portfolio?.socialLinks?.twitter || 'https://twitter.com',
          }
        });
      } catch (error) {
        console.error('Failed to fetch footer data:', error);
      }
    };

    fetchFooterData();
  }, []);

  const socialLinks = [
    { Icon: Github, href: footerData.socialLinks.github, label: 'GitHub' },
    { Icon: Linkedin, href: footerData.socialLinks.linkedin, label: 'LinkedIn' },
    { Icon: Twitter, href: footerData.socialLinks.twitter, label: 'Twitter' },
    { Icon: Mail, href: `mailto:${footerData.email}`, label: 'Email' },
  ];

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <motion.h3
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
              whileHover={{ scale: 1.05 }}
            >
              {footerData.fullName}
            </motion.h3>
            <p className="text-gray-400 mb-4">
              {footerData.bio}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-gray-400 hover:text-blue-400 transition-colors inline-block"
                    whileHover={{ x: 5 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter/CTA */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Stay Connected</h4>
            <p className="text-gray-400 mb-4">
              Interested in collaborating? Let's build something amazing together.
            </p>
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#contact');
              }}
              className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
            </motion.a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} {footerData.fullName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
