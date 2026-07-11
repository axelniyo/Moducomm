const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('NEW', 'CONFIRMED', 'PROCESSED', 'CANCELLED'),
    defaultValue: 'NEW',
  },
  totalAmount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },
  // userId FK added via associations.js
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;
