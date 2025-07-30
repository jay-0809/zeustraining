const { UserModel } = require('../Models/UserModel');

let batchCounter = 0;
let resetTime = Date.now() + 15 * 1000; // 60 seconds from now

// Function to get user details by ID
const getUser = async (req, res) => {
    const currentTime = Date.now();

    // Reset the batch counter every 60 seconds
    if (currentTime >= resetTime) {
        batchCounter = 0;
        resetTime = currentTime + 15 * 1000;
    }

    // If limit reached, reject
    if (batchCounter >= 100) {
        return null;
        // res.status(200).json({ message: 'Rate limit exceeded: Only 100 batches per minute allowed' });
        // return res.status(429).json({ message: 'Rate limit exceeded: Only 100 batches per minute allowed' });
    }

    const startId = parseInt(req.params.id); 
    const endId = startId + 99;
    try {
        const users = await UserModel.find({
            _id: { $gte: startId, $lte: endId }
        }).sort({ _id: 1 }); // Optional: sort by userId ascending

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found in this range' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        if (!users) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Function to create a new user
const createUser = async (req, res) => {
    const newUser = new UserModel(req.body);
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getUser,
    getUsers,
    createUser
};