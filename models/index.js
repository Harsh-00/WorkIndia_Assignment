const User = require('./user');
const Train = require('./train');
const Booking = require('./booking');
const Seat = require('./seat');

User.hasMany(Booking);
Booking.belongsTo(User);

Train.hasMany(Booking);
Booking.belongsTo(Train);

Train.hasMany(Seat);
Seat.belongsTo(Train);

Seat.hasOne(Booking); 
Booking.belongsTo(Seat); 

module.exports = {
  User,
  Train,
  Booking,
  Seat,
};
