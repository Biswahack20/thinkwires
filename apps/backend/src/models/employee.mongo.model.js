import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    technicalSkills: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: 0,
    },
    availability: {
      type: String,
      enum: ['Immediate', '15 Days', '30 Days', 'Employed'],
      default: 'Immediate',
    },
    deploymentStatus: {
      type: String,
      enum: ['Available', 'Deployed', 'On Notice', 'Bench'],
      default: 'Available',
    },
    billingRate: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: 'Remote',
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

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

export default Employee;
