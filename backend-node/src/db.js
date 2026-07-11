const { Sequelize } = require('sequelize');
require('dotenv').config();

// Neon provides a single connection string in DATABASE_URL
// Format: postgresql://user:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Neon uses self-signed certs
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = { sequelize };
