/**
 * Seed Case Studies Script
 * Run with: node src/seeds/seedCaseStudies.js
 * Make sure MongoDB is connected and MONGODB_URI is set in .env
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CaseStudy from '../models/CaseStudy.js';
import { caseStudyData } from './caseStudySeed.js';
import { connectDB } from '../config/db.js';

// Load environment variables
dotenv.config();

const seedCaseStudies = async () => {
  try {
    console.log('🌱 Starting Case Studies seed...');
    
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing case studies
    const deletedCount = await CaseStudy.deleteMany({});
    console.log(`🗑️  Cleared ${deletedCount.deletedCount} existing case studies`);

    // Insert new case studies
    const inserted = await CaseStudy.insertMany(caseStudyData);
    console.log(`✅ Successfully seeded ${inserted.length} case studies`);

    // Log the inserted data
    console.log('\n📋 Seeded Case Studies:');
    inserted.forEach((study, index) => {
      console.log(`${index + 1}. ${study.title} (ID: ${study._id})`);
    });

    console.log('\n✨ Seed completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

// Run seed
seedCaseStudies();
