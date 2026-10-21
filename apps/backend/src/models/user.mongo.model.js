import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
      select: false,
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

// Hash password with bcrypt before saving if modified
userMongoSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  // Prevent double-hashing if password is already a bcrypt hash
  if (typeof this.password === 'string' && /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(this.password)) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to verify password securely
userMongoSchema.methods.comparePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const UserMongo = mongoose.models.User || mongoose.model('User', userMongoSchema);

export default UserMongo;
