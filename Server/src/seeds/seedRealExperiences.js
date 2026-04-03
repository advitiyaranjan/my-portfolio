import mongoose from 'mongoose';
import Experience from '../models/Experience.js';
import { config } from 'dotenv';

config();

const realExperiences = [
  {
    title: 'Blockchain & Governance Research',
    company: 'Working Group on Technology for Viksit Bharat',
    location: 'India - Remote',
    description: 'Researched and prototyped Blockchain-based governance systems to enhance transparency, security, and efficiency in public service delivery. Designed use-cases for Decentralized Identity (DID) and Smart Contracts in citizen authentication, land records, and subsidy automation. Explored AI-driven policy analytics, IoT-enabled infrastructure monitoring, and integration with Digital Public Goods for scalable, citizen-centric solutions.',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-07-31'),
    isCurrentRole: false,
    technologies: ['Blockchain', 'Smart Contracts', 'Decentralized Identity (DID)', 'AI Policy Analytics', 'IoT Monitoring', 'Digital Public Goods'],
    gradient: 'from-blue-500 to-cyan-500',
    color: 'blue',
    order: 1,
  },
  {
    title: 'Data Analyst Intern',
    company: 'Deloitte',
    location: 'Australia - Remote',
    description: 'Completed Data Analytics Job Simulation demonstrating proficiency in problem-solving, data analysis, and advanced analytics. Applied statistical methods and visualization techniques to extract actionable insights from complex datasets. Developed skills in data interpretation, business analytics, and reporting.',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-04-30'),
    isCurrentRole: false,
    technologies: ['Data Analysis', 'Problem Solving', 'Data Visualization', 'Statistical Analysis', 'Business Analytics', 'SQL', 'Excel'],
    gradient: 'from-purple-500 to-pink-500',
    color: 'purple',
    order: 2,
  },
];

async function seedRealExperiences() {
  try {
    console.log('🌱 Starting Real Experiences Seed...');
    
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing experiences
    await Experience.deleteMany({});
    console.log('🗑️  Cleared existing experiences');

    // Insert new experiences
    const created = await Experience.insertMany(realExperiences);
    console.log(`✅ Successfully created ${created.length} experiences`);
    
    created.forEach((exp, index) => {
      console.log(`${index + 1}. ${exp.title} at ${exp.company}`);
    });

    await mongoose.connection.close();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Error seeding experiences:', error.message);
    process.exit(1);
  }
}

seedRealExperiences();
