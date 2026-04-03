import mongoose from 'mongoose';

const caseStudySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    challenge: String,
    solution: String,
    results: String,
    technologies: [String],
    link: String,
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);

export default CaseStudy;
