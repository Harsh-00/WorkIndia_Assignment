const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
 
dotenv.config();
const app = express();
app.use(express.json());

// Routes
app.use('/api', require('./routes/index')); 

app.get('/', (req, res) => res.send('IRCTC API is running '));

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.sync({ alter: true }); // <--- Auto create/update tables
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('DB sync error:', err);
  }
});
