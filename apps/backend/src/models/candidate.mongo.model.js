import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Candidate email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    currentRole: {
      type: String,
      default: 'Software Engineer',
    },
    technicalSkills: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    expectedSalary: {
      type: String,
      default: 'Market Standard',
    },
    status: {
      type: String,
      enum: ['Applied', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected'],
      default: 'Applied',
    },
    appliedForJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobRequirement',
      default: null,
    },
    jobTitle: {
      type: String,
      default: 'General Technical Talent',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);

export default Candidate;
