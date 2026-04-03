import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    techStack: [
      {
        type: String,
        required: true,
      },
    ],
    imageUrl: {
      type: String,
      required: [true, 'Please provide a project image URL'],
    },
    imageAlt: {
      type: String,
      default: 'Project image',
    },
    githubLink: {
      type: String,
      match: [
        /^https?:\/\/(www\.)?github\.com\/.+/,
        'Please provide a valid GitHub URL',
      ],
    },
    liveLink: {
      type: String,
      match: [
        /^https?:\/\/.+/,
        'Please provide a valid URL',
      ],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
