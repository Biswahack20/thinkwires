const { Sequelize } = require('sequelize');
import config from '../configs/dotenv.js';

// Option 1: Passing a connection URI
const sequelize = new Sequelize(config.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
});