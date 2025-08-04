const mongoose = require('mongoose');

const userTempSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    }
});

const UserTempModel = mongoose.model('UserTemporary', userTempSchema);
module.exports = UserTempModel;