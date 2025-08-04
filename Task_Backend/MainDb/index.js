const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const PORT = 8080;
const MONGO_URL = 'mongodb+srv://maindb:12345@main.zjtufrh.mongodb.net/';

app.use(cors());
app.use(express.json());

const userTempRoutes = require('./Routes/userTempRoutes');
const userRoutes = require('./Routes/userRoutes');

app.use('/api/user-temp', userTempRoutes);
app.use('/api', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Main API');
});

const connectDB = (url) => {
    return mongoose
        .connect(url)
        .then((conn) => {
            console.log(`db connected: ${conn.connection.host}`);
        })
        .catch((err) => {
            console.log(`error in connected db: ${err}`);
        });
};

// Start server
const start = async () => {
    try {
        await connectDB(MONGO_URL);        
        app.listen(PORT, () => {
        console.log(`Main Database API is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();