const UserTempModels = require('../Models/UserTempModels');
const UserModel = require('../Models/UserModels');

let lastFetchId = 1;
let percent = 0;
let faildTOFetch = 0;
let interval = null;
let isPaused = false;

/**
 * Get user's data from Thirdparty API in batches
 */
const getUserTempData = async (req, res) => {
    try {
        lastFetchId = parseInt(req.params.lastFetchId || lastFetchId);

        interval = setInterval(async () => {
            if (isPaused) return;
            let users = [];

            try {
                const response = await fetch(`http://localhost:3000/api/users/${lastFetchId}`);

                if (response.status === 404) {
                    console.log('------No users found');
                    clearInterval(interval);
                    return res.status(404).json({ message: 'No more user data to fetch' });
                } else if (response.status === 429) {
                    users = 'rate-limit';
                }

                users = await response.json();
            } catch (err) {
                faildTOFetch++;
                console.log('------Thirdparty is OFFLINE or unreachable (fetch failed):', err.message);
            }

            if (faildTOFetch >= 5) {
                clearInterval(interval);
                res.status(500).json({ message: 'Error fetching user data' });
            } else if (users === 'rate-limit') {
                console.log('Rate limit hit — On Rest');
            } else if (users && users.length > 0) {
                await UserTempModels.insertMany(users);
                console.log(`Fetched ${users.length} users from ${lastFetchId} Thirdparty API`);

                lastFetchId = lastFetchId + users.length;
                percent = parseInt((lastFetchId / 60000) * 100);
                faildTOFetch = 0;
            }

            if (percent >= 100) {
                clearInterval(interval);
            }
        }, 500);

        res.status(200).json({ message: 'Started fetching users' });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user data' });
    }
};

/** 
 * pause and resume fetching user data
 */
const togglePause = (req, res) => {
    isPaused = !isPaused;
    if (isPaused) {
        console.log('Fetching paused');
        res.status(200).json({ message: 'Fetching paused' });
    } else {
        console.log('Fetching resumed');
        res.status(200).json({ message: 'Fetching resumed' });
    }
};

/**
 * Get all user temporary data and store to main database
 */
const getAllUserTempData = async (req, res) => {
    try {
        const userTempData = await UserTempModels.find({});
        if (userTempData.length === 0) {
            return res.status(404).json({ message: 'No temporary user data found' });
        }

        res.status(200).json(userTempData);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Store all user temporary data to main 
 */
const storeUserTempData = async (req, res) => {
    try {
        const userTempData = await UserTempModels.find({});
        if (userTempData.length === 0) {
            return res.status(404).json({ message: 'No temporary user data found' });
        }

        await UserModel.deleteMany({}); // Clear temporary data after storing

        // Store this data in the main table
        await UserModel.insertMany(userTempData);
        console.log(`Successfully inserted ${userTempData.length} temporary users into main database`);

        res.status(200).json({ message: 'Temporary user data stored successfully to Main' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * delete all user temporary data
 */
const deleteAllUserTempData = async (req, res) => {
    try {
        await UserTempModels.deleteMany({});
        res.status(200).json({ message: 'All temporary user data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting temporary user data' });
    }
};

module.exports = {
    getUserTempData,
    togglePause,
    storeUserTempData,
    getAllUserTempData,
    deleteAllUserTempData
};
