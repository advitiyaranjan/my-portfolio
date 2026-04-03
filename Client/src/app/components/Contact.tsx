import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useInView } from './hooks/useInView';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, Check, AlertCircle } from 'lucide-react';
import { contactAPI, portfolioAPI } from '@/utils/api';
import { AnimatedBackground } from './AnimatedBackground';

export function Contact() {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [socialLinks, setSocialLinks] = useState({
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
  });

  // Fetch social links from portfolio
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await portfolioAPI.getPortfolio();
        console.log('Portfolio response:', response);
        
        // Handle both response formats (direct data or wrapped in data field)
        const portfolioData = response?.data || response;
        
        if (portfolioData?.socialLinks) {
          console.log('Social links found:', portfolioData.socialLinks);
          setSocialLinks({
            github: portfolioData.socialLinks.github || 'https://github.com',
            linkedin: portfolioData.socialLinks.linkedin || 'https://linkedin.com',
            twitter: portfolioData.socialLinks.twitter || 'https://twitter.com',
          });
        } else {
          console.log('No social links found in portfolio');
        }
      } catch (error) {
        console.error('Failed to fetch social links:', error);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      console.log('Submitting message:', {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      const result = await contactAPI.submitForm({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      
      console.log('Message submitted successfully:', result);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error: any) {
      console.error('Failed to send message - Full Error:', {
        statusCode: error?.response?.status,
        statusText: error?.response?.statusText,
        message: error?.message,
        responseData: error?.response?.data,
        errorText: error?.errorText,
        fullError: error,
      });
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      Icon: Mail,
      label: 'Email',
      value: 'advitiyaranjan1@gmail.com',
      href: 'mailto:advitiyaranjan1@gmail.com',
    },
    {
      Icon: Phone,
      label: 'Phone',
      value: '+91 9430435643',
      href: 'tel:+919430435643',
    },
    {
      Icon: MapPin,
      label: 'Location',
      value: 'IIITM Gwalior, Madhya Pradesh, India 474015',
      href: null,
    },
  ];

  const socialMediaLinks = [
    { Icon: Github, href: socialLinks.github, label: 'GitHub', color: 'hover:bg-gray-700' },
    { Icon: Linkedin, href: socialLinks.linkedin, label: 'LinkedIn', color: 'hover:bg-blue-600' },
    { Icon: Twitter, href: socialLinks.twitter, label: 'Twitter', color: 'hover:bg-sky-500' },
  ];

  return (
    <section id="contact" className="py-20 bg-gray-950 relative overflow-hidden" ref={ref}>
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full mb-4" />
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a project in mind or want to discuss opportunities? Let's connect!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info & Social Links */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  {info.href ? (
                    <a
                      href={info.href}
                      className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl hover:shadow-lg transition-shadow border border-blue-200 dark:border-blue-800 group"
                    >
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                        <info.Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{info.label}</p>
                        <p className="font-medium text-gray-800 dark:text-white">{info.value}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                        <info.Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{info.label}</p>
                        <p className="font-medium text-gray-800 dark:text-white">{info.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Connect on Social Media
              </h3>
              <div className="flex gap-4">
                {socialMediaLinks.map(({ Icon, href, label, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 bg-gray-100 dark:bg-gray-800 rounded-xl hover:text-white transition-colors ${color}`}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={label}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Decorative Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="p-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white"
            >
              <h3 className="text-2xl font-bold mb-2">Open to Opportunities</h3>
              <p className="text-blue-100">
                Currently exploring new roles in product management and technical leadership.
                Let's build something amazing together!
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between">
                    <span>Message</span>
                    <span className={`text-xs ${formData.message.length < 10 ? 'text-red-500' : 'text-green-500'}`}>
                      {formData.message.length}/10 minimum
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    minLength={10}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 dark:text-white"
                    placeholder="Tell me about your project or opportunity... (minimum 10 characters)"
                  />
                  {formData.message.length < 10 && formData.message.length > 0 && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                      Message must be at least 10 characters long
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || formData.message.length < 10 || !formData.name || !formData.email}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 font-medium rounded-lg transition-all ${
                    isSubmitting || formData.message.length < 10 || !formData.name || !formData.email
                      ? 'bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl'
                  }`}
                  whileHover={!(isSubmitting || formData.message.length < 10 || !formData.name || !formData.email) ? { scale: 1.02 } : {}}
                  whileTap={!(isSubmitting || formData.message.length < 10 || !formData.name || !formData.email) ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : formData.message.length < 10 ? (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      <span>Message too short ({formData.message.length}/10)</span>
                    </>
                  ) : !formData.name || !formData.email ? (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      <span>Please fill all fields</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300"
                  >
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <h4 className="font-semibold mb-1">Thank you for connecting!</h4>
                        <p className="text-sm">We will respond to your message soon. Looking forward to hearing from you.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <h4 className="font-semibold mb-1">Failed to send message</h4>
                        <ul className="text-sm space-y-1">
                          <li>✓ Name - required</li>
                          <li>✓ Email - valid email required</li>
                          <li>✓ Message - minimum 10 characters (currently {formData.message.length})</li>
                        </ul>
                        <p className="text-sm mt-2">Please check the requirements above and try again.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
