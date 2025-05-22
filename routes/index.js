const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');
const { addTrain, getTrainsBetweenStations } = require('../controllers/train');
const authenticateAdmin = require('../middleware/admin');
const authenticateUser = require('../middleware/auth');
const {
  getSeatAvailability,
  bookSeat,
  getMyBookings,
} = require('../controllers/booking');


router.post('/auth/register', register);
router.post('/auth/login', login);
 
router.post('/trains', authenticateAdmin, addTrain);  
router.get('/trains', getTrainsBetweenStations);      

router.get('/booking/availability', getSeatAvailability);
router.post('/booking/book', authenticateUser, bookSeat);
router.get('/booking/me', authenticateUser, getMyBookings);

module.exports = router;
