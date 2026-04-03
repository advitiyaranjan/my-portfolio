import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    endDate: Date,
    isCurrentRole: {
      type: Boolean,
      default: false,
    },
    technologies: [String],
    order: {
      type: Number,
      default: 0,
    },
    gradient: {
      type: String,
      enum: [
        'from-blue-500 to-cyan-500',
        'from-purple-500 to-pink-500',
        'from-green-500 to-emerald-500',
        'from-orange-500 to-red-500',
        'from-indigo-500 to-blue-500',
        'from-teal-500 to-blue-500',
      ],
      default: 'from-blue-500 to-cyan-500',
    },
    color: {
      type: String,
      enum: ['blue', 'purple', 'green', 'orange', 'indigo', 'teal'],
      default: 'blue',
    },
  },
  { timestamps: true }
);

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;
