import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    // Personal Information
    fullName: {
      type: String,
      default: 'Advitiya Ranjan',
    },
    title: {
      type: String,
      default: 'Full Stack Developer & Blockchain Engineer',
    },
    bio: {
      type: String,
      default: 'Building innovative solutions with React, Node.js, and Blockchain...',
    },
    
    // About section - detailed description
    aboutDescription: {
      type: String,
      default: 'I\'ve successfully worked on diverse projects from governance technologies with the Government of India\'s Viksit Bharat initiative to blockchain-based voting systems and AI-powered finance trackers. My focus is on creating scalable, secure, and user-centric solutions that combine cutting-edge technology with practical utility.\n\nWith GATE 2026 qualification (AIR 3460) and active involvement in leadership initiatives like SOUL Bihar & Jharkhand, I\'m committed to continuous learning and making a meaningful impact through technology and innovation.',
    },
    
    
    // Media
    profileImage: {
      type: String,
      default: '/images/profile.jpg',
      description: 'URL to profile image stored in backend',
    },
    resumeLink: {
      type: String,
      default: '',
      description: 'Google Drive or external link to resume PDF',
    },
    
    // Social Links
    socialLinks: {
      github: { type: String, default: 'https://github.com/advitiyaranjan' },
      linkedin: { type: String, default: 'https://www.linkedin.com/in/advitiya-ranjan' },
      email_link: { type: String, default: 'mailto:advityaranjan1@gmail.com' },
      twitter: String,
      portfolio: String,
    },
    
    // Additional Info
    location: String,
    headline: String,
    
    // SEO & Meta
    keywords: [String],
    description: String,
    
    // Stats - Displayed on About/Hero section
    stats: {
      projectsCompleted: { type: Number, default: 50 },
      yearsExperience: { type: Number, default: 5 },
      usersImpacted: { type: Number, default: 100 },
      technologiesCount: { type: Number, default: 15 },
    },

    // View Count
    viewCount: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Update lastUpdated on any change
portfolioSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.model('Portfolio', portfolioSchema);
