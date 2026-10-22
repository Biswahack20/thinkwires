import { Sequelize } from 'sequelize';
import config from './dotenv.js';

// Option 1: Passing a connection URI
export const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    connectTimeout: 3000,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 3000,
    idle: 5000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};
