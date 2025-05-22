const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Seat = sequelize.define('Seat', {
  seatNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isBooked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  trainCode: {
    type: DataTypes.STRING,
    allowNull: false, // always set
  }
});

module.exports = Seat;
