const axios = require("axios");
const UserModel = require("../Models/UserModels");

const getUsers = async (req, res) => {
    try {
        const last_id = parseInt(req.params.id); 
        // console.log('Fetching users with last_id:', last_id);

        const response = await axios.get(`http://localhost:3000/api/users/${last_id}`);
        // console.log('Response from Third Party DB:', response);
        const users = response.data;
        // console.log('Fetched users:', users);

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        await UserModel.insertMany(users); 
        console.log(`Successfully inserted ${last_id} users`);

        res.status(200).json(users);
    } catch (error) {
        // console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createUser = async (req, res) => {
    const newUser = new UserModel(req.body);
    try {
        if (newUser) {
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteUsers = async (req, res) => {
    try {
        const result = await UserModel.deleteMany({});
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'All users deleted successfully' });
        } else {
            res.status(404).json({ message: 'No users found to delete' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getUsers,
    createUser,
    deleteUsers
};
