const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
  seatNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});


module.exports = Booking;
