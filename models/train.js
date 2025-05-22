const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Train = sequelize.define('Train', {
  trainCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalSeats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 1, 
    },
  },
});

module.exports = Train;
