import User from '../models/user.model.js';
import UserMongo from '../models/user.mongo.model.js';
import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const isMongoActive = () => mongoose.connection.readyState === 1;

/**
 * User Controller
 * Provides standardized user profile and directory operations with dual-persistence support.
 */

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const userEmail = req.user?.email;

    if (!userId && !userEmail) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No active user session.' });
    }

    let user = null;

    if (isMongoActive()) {
      user = userId
        ? await UserMongo.findById(userId).select('-password').lean()
        : await UserMongo.findOne({ email: userEmail.toLowerCase() }).select('-password').lean();
    } else {
      user = userId
        ? await User.findByPk(userId)
        : await User.findOne({ where: { email: userEmail.toLowerCase() } });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found.' });
    }

    res.json({ success: true, user });
  } catch (err) {
    logger.error('Error fetching user profile:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const userEmail = req.user?.email;
    const { name, phone, designation } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (designation) updates.designation = designation.trim();

    let updatedUser = null;

    if (isMongoActive()) {
      const query = userId ? { _id: userId } : { email: userEmail.toLowerCase() };
      updatedUser = await UserMongo.findOneAndUpdate(query, updates, { new: true })
        .select('-password')
        .lean();
    } else {
      const user = userId
        ? await User.findByPk(userId)
        : await User.findOne({ where: { email: userEmail.toLowerCase() } });

      if (user) {
        await user.update(updates);
        updatedUser = user.toJSON();
      }
    }

    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'User record not found.' });
    }

    logger.info(`Profile updated for user: ${updatedUser.email}`);
    res.json({ success: true, message: 'Profile updated successfully.', user: updatedUser });
  } catch (err) {
    logger.error('Error updating user profile:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export default {
  getProfile,
  updateProfile,
};
