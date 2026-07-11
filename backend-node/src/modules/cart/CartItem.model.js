const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db');

const CartItem = sequelize.define('CartItem', {
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
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // cartId FK added via associations.js
}, {
  tableName: 'cart_items',
  timestamps: true,
});

module.exports = CartItem;
