const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  // orderId FK added via associations.js
}, {
  tableName: 'order_items',
  timestamps: true,
});

module.exports = OrderItem;
