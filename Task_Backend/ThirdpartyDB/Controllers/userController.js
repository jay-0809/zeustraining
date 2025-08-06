const { UserModel } = require('../Models/UserModel');

let batchCounter = 0;
let resetTime = Date.now() + 1 * 60 * 1000; // 60 seconds from now

const getUser = async (req, res) => {
    const currentTime = Date.now();
    // console.log(`Current time: ${currentTime}, Reset time: ${resetTime}, Batch counter: ${batchCounter}`);
    
    // Reset the batch counter every 60 seconds
    if (currentTime >= resetTime) {
        batchCounter = 0;
        resetTime = currentTime + 1 * 60 * 1000;
    }

    // If limit reached, reject
    if (batchCounter >= 100) {
        const retryAfter = Math.ceil((resetTime - currentTime) / 1000);
        // console.log('Rate limit exceeded: Only 100 batches per minute allowed');
        return res
                .status(429)
                .set('Retry-After', retryAfter)
                .json({ message: 'Rate limit exceeded: Only 100 batches per minute allowed' });
    }

    const startId = parseInt(req.params.id); 
    console.log(`Fetching users from ID: ${startId}`);
    
    const endId = startId + 99;
    try {
        const users = await UserModel.find({
            _id: { $gte: startId, $lte: endId }
        }).sort({ _id: 1 }); // Optional: sort by userId ascending

        // console.log(users);
        
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found in this range' });
        }
        batchCounter++;
        res.status(200).json(users);
    } catch (error) {
        console.log('Error fetching users:', error);
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
        // console.error('Error fetching user:', error);
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
        // console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getUser,
    getUsers,
    createUser
};