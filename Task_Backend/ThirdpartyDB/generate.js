// generate.js
const mongoose = require("mongoose");
const { UserModel } = require("./Models/UserModel");

const MONGO_URL = 'mongodb+srv://tpdb:12345@thirdparty.lwofrik.mongodb.net/';

const firstNames = ["Raj", "Ameet", "Harsh", "Jay", "Anil", "Neha", "Ravi", "Kiran", "Vijay", "Deepak"];
const lastNames = ["Solanki", "Mishra", "Patel", "Talaviya", "Mehta", "Verma", "Desai", "Iyer", "Reddy", "Kapoor", "Bose"];


function generateRandomData(count) {
    const users = [];

    for (let i = 1; i <= count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${firstName} ${lastName}`;
        const age = Math.floor(Math.random() * 82) + 18;
        const email = `${firstName.toLowerCase()}${lastName.toLowerCase()}${age}@gmail.com`;

        users.push({
            _id: i,
            name: fullName,
            email,
            age
        });
    }

    return users;
}

const insertData = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");

        const userData = generateRandomData(60000);

        // Optional: clear existing for fresh run
        await UserModel.deleteMany({});

        await UserModel.insertMany(userData);
        console.log("✅ Successfully inserted 60,000 users");

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("❌ Error inserting users:", error);
    }
};

insertData();
