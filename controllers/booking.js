const { Booking, Train, Seat } = require('../models'); 

const getSeatAvailability = async (req, res) => {
  try {
    const { source, destination } = req.query;
    if (!source || !destination) 
      return res.status(400).json({ message: 'Source and destination are required' });

    const trains = await Train.findAll({
      where: { source, destination },
      include: [Seat],
    });

    const result = trains.map((train) => {
      const totalSeats = train.totalSeats;
      const bookedSeats = train.Seats.filter(seat => seat.isBooked).length;
      const availableSeats = totalSeats - bookedSeats;

      return {
        trainId: train.id,
        trainCode: train.trainCode,
        name: train.name,
        source: train.source,
        destination: train.destination,
        totalSeats: train.totalSeats,
        availableSeats,
      };
    });
 
    res.status(200).json({ trains: result });
  } catch (err) {
    res.status(500).json({ error: 'Error getting availability', details: err.message });
  }
};
 

const bookSeat = async (req, res) => {
  const t = await Booking.sequelize.transaction();
  try {
    const { trainCode } = req.body;
    const userId = req.user.id;

    const train = await Train.findOne({ where: { trainCode } });
    if (!train) return res.status(404).json({ message: 'Train not found' });

   
    const seat = await Seat.findOne({
      where: { TrainId: train.id, isBooked: false },
      order: [['seatNumber', 'ASC']],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!seat) {
      await t.rollback();
      return res.status(400).json({ message: 'No seats available' });
    }

    seat.isBooked = true;
    await seat.save({ transaction: t });

    const booking = await Booking.create(
      {
        seatNumber: seat.seatNumber,
        TrainId: train.id,
        UserId: userId,
        SeatId: seat.id,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({
      message: 'Seat booked successfully',
      booking: {
        id: booking.id,
        seatNumber: booking.seatNumber,
        trainCode: train.trainCode,
        trainId: train.id
      }
    });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ error: 'Booking failed', details: err.message });
  }
};


const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
      where: { UserId: userId },
      include: [
        {
          model: Train,
          attributes: ['trainCode', 'name', 'source', 'destination']
        },
        {
          model: Seat,  
          attributes: ['seatNumber']
        }
      ]
    });

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
};

module.exports = {
  getSeatAvailability,
  bookSeat,
  getMyBookings,
};
