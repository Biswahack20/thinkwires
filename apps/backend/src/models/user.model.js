import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../configs/db.js';
import bcrypt from 'bcryptjs';

/**
 * Sequelize User Model for PostgreSQL
 * Represents system users, administrative identities, and audit references in PostgreSQL.
 */
export class User extends Model {
  /**
   * Helper method to verify passwords against bcrypt hash
   * @param {string} candidatePassword
   * @returns {Promise<boolean>}
   */
  async comparePassword(candidatePassword) {
    if (!candidatePassword || !this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
  }

  /**
   * Strip sensitive data when converting to JSON
   */
  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('superadmin', 'admin', 'cms_admin', 'user'),
      defaultValue: 'user',
    },
    designation: {
      type: DataTypes.STRING,
      defaultValue: 'System Member',
    },
    phone: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const isBcrypt =
            typeof user.password === 'string' &&
            /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(user.password);
          if (!isBcrypt) {
            const salt = await bcrypt.genSalt(12);
            user.password = await bcrypt.hash(user.password, salt);
          }
        }
      },
    },
  }
);

export default User;
