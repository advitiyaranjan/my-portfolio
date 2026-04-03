import mongoose from 'mongoose';
import Experience from '../models/Experience.js';
import { config } from 'dotenv';

config();

const gradients = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-indigo-500 to-blue-500',
  'from-teal-500 to-blue-500',
];

const colors = ['blue', 'purple', 'green', 'orange', 'indigo', 'teal'];

async function seedExperienceGradients() {
  try {
    console.log('🌱 Starting Experience Gradient Seed...');
    
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const experiences = await Experience.find().sort({ order: 1 });
    console.log(`📋 Found ${experiences.length} experiences`);

    for (let i = 0; i < experiences.length; i++) {
      const gradientIndex = i % gradients.length;
      const colorIndex = i % colors.length;
      
      experiences[i].gradient = gradients[gradientIndex];
      experiences[i].color = colors[colorIndex];
      
      await experiences[i].save();
      console.log(`✅ Updated: ${experiences[i].title} with ${gradients[gradientIndex]}`);
    }

    console.log('✅ Successfully updated all experiences with gradients');
    await mongoose.connection.close();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Error seeding experience gradients:', error.message);
    process.exit(1);
  }
}

seedExperienceGradients();
