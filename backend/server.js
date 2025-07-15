const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const deviceRoutes = require('./routes/devices.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API route
app.use('/devices', deviceRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        })
    .then(() => {
        console.log('MongoDB kapcsolódva');
        app.listen(PORT, () => {
            console.log(`Szerver fut a http://localhost:${PORT} címen`);
        });
    })
    .catch((err) => {
        console.error('MongoDB hiba:', err);
    });
