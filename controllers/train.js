const { Train,Seat } = require('../models');
const { Op } = require('sequelize');


const addTrain = async (req, res) => {
  try {
    const { trainCode, name, source, destination, totalSeats } = req.body;

    let train = await Train.findOne({ where: { trainCode } });

    if (train) { 
      const oldSeatCount = train.totalSeats;
      train.totalSeats = totalSeats;
      train.name = name || train.name;
      train.source = source || train.source;
      train.destination = destination || train.destination;
      await train.save();

      if (totalSeats > oldSeatCount) {
        const newSeats = [];
        for (let i = oldSeatCount + 1; i <= totalSeats; i++) {
          newSeats.push({
            seatNumber: i,
            TrainId: train.id,
            trainCode: train.trainCode
          });
        }
        await Seat.bulkCreate(newSeats);

      } else if (totalSeats < oldSeatCount) {
         
        const seatsToRemove = await Seat.findAll({
          where: {
            TrainId: train.id,
            seatNumber: { [Op.gt]: totalSeats }
          }
        });

        const bookedSeats = seatsToRemove.filter(seat => seat.isBooked);
        if (bookedSeats.length > 0) {
          return res.status(400).json({
            message: 'Cannot reduce seat count — some of the seats are already booked',
          });
        }

        await Seat.destroy({
          where: {
            TrainId: train.id,
            seatNumber: { [Op.gt]: totalSeats }
          }
        });
      }

      return res.status(201).json({ message: 'Train updated', train });
    }

    train = await Train.create({ trainCode, name, source, destination, totalSeats });
 

    const seatData = [];
    for (let i = 1; i <= totalSeats; i++) {
      seatData.push({
        seatNumber: i,
        TrainId: train.id,
        trainCode: train.trainCode, 
      });
    }
    await Seat.bulkCreate(seatData);
 
    res.status(201).json({ message: 'Train added', train });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add or update train', details: err.message });
  }
};
 

const getTrainsBetweenStations = async (req, res) => {
  try {
    const { source, destination } = req.query;
    const trains = await Train.findAll({
      where: { source, destination }
    });

    res.json({ trains });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching trains', details: err.message });
  }
};

module.exports = { addTrain, getTrainsBetweenStations };
