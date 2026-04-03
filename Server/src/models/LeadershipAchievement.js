import mongoose from 'mongoose';

const leadershipAchievementSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      required: [true, 'Please provide an icon name'],
      enum: ['Award', 'Target', 'Users', 'Zap'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    subtitle: {
      type: String,
      required: [true, 'Please provide a subtitle'],
      maxlength: [200, 'Subtitle cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    details: [
      {
        type: String,
        maxlength: [100, 'Each detail cannot be more than 100 characters'],
      },
    ],
    gradient: {
      type: String,
      required: [true, 'Please provide a gradient'],
      enum: [
        'from-blue-500 to-cyan-500',
        'from-purple-500 to-pink-500',
        'from-green-500 to-emerald-500',
        'from-orange-500 to-red-500',
      ],
    },
    color: {
      type: String,
      required: [true, 'Please provide a color'],
      enum: ['blue', 'purple', 'green', 'orange'],
    },
    order: {
      type: Number,
      default: 0,
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

const LeadershipAchievement = mongoose.model(
  'LeadershipAchievement',
  leadershipAchievementSchema
);

export default LeadershipAchievement;
