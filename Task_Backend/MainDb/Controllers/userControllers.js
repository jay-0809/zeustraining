const {UserModels} = require("../Models/UserModels");


const getUsers = async(req, res)=>{
    try {
        const lastId = req.params.id;
        const users = await UserModels.find({ _id: { $gt: lastId } }).limit(100);
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({message: 'Internal server error' });
    }
}

const createUser = async(req, res)=>{
    const newUser = new UserModels(req.body);
    try {
        if(newUser){
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({message: 'Internal server error' });
    }
}

module.exports = {
    getUsers,
    createUser
};
