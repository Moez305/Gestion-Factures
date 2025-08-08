const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Bill = require('./Bill');

const BillItem = sequelize.define('BillItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bill_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'bills',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'bill_items',
  timestamps: true
});

// Define associations
BillItem.belongsTo(Bill, { foreignKey: 'bill_id' });
Bill.hasMany(BillItem, { foreignKey: 'bill_id' });

module.exports = BillItem; 