const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'usd',
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
    defaultValue: 'PENDING',
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  provider: {
    type: DataTypes.ENUM('STRIPE'),
    defaultValue: 'STRIPE',
  },
  // userId FK added via associations.js
}, {
  tableName: 'payments',
  timestamps: true,
});

module.exports = Payment;
