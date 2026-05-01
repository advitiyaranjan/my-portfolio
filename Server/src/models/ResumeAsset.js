import mongoose from 'mongoose';

const resumeAssetSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      default: 'application/pdf',
    },
    size: {
      type: Number,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ResumeAsset || mongoose.model('ResumeAsset', resumeAssetSchema);