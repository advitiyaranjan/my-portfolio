import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LeadershipAchievement from '../models/LeadershipAchievement.js';
import leadershipAchievementData from './leadershipSeed.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log(`✅ Connected to MongoDB`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedLeadershipAchievements = async () => {
  try {
    console.log('🌱 Starting Leadership Achievements seed...');

    // Connect to DB
    await connectDB();

    // Clear existing achievements
    const deletedCount = await LeadershipAchievement.deleteMany({});
    console.log(`🗑️  Cleared ${deletedCount.deletedCount} existing achievements`);

    // Insert new data
    const seededAchievements = await LeadershipAchievement.insertMany(leadershipAchievementData);
    console.log(`✅ Successfully seeded ${seededAchievements.length} achievements`);

    console.log('📋 Seeded Leadership Achievements:');
    seededAchievements.forEach((achievement, index) => {
      console.log(
        `${index + 1}. ${achievement.title} (ID: ${achievement._id})`
      );
    });

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedLeadershipAchievements();
