import mongoose from 'mongoose';

const userMongoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'cms_admin', 'user'],
      default: 'superadmin',
    },
    designation: {
      type: String,
      default: 'System Member',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const UserMongo = mongoose.model('User', userMongoSchema);

export default UserMongo;
