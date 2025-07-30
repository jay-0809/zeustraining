const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const app = express();
const port = 3000;
const MONGO_URL = 'mongodb+srv://tpdb:12345@thirdparty.lwofrik.mongodb.net/';

app.use(cors()); // Allow all origins
app.use(express.json());

const userRoutes = require('./Routes/userRoute');
app.use('/api', userRoutes);

app.get("/", (req, res) => {
    res.json("Hello");
})


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
        app.listen(port, () => {
            console.log(`Third Party Database API is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
