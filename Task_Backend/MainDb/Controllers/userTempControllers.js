const UserTempModels = require('../Models/UserTempModels');
const UserModel = require('../Models/UserModels');

let lastFetchId = 1;
let percent = 0;
let faildTOFetch = 0;
let interval = null;
let isPaused = false;
let isInRateLimit = false;
let isCancel = false;

// const fetchAndStore = async () => {
//     if (isPaused) return { status: 400, message: 'Paused' };

//     let users = [];

//     try {
//         const response = await fetch(`http://localhost:3000/api/users/${lastFetchId}`);

//         if (response.status === 404) {
//             console.log('------No users found');
//             return { status: 404, message: 'No more user data to fetch' };
//         } else if (response.status === 429) {
//             const retryAfter = response.headers.get('Retry-After');
//             const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 3000;
//             console.log(`------Rate limit hit, waiting... ${(waitTime)}`);
//             setTimeout(fetchAndStore, waitTime);
//             return { status: 429, message: 'Rate limited, retrying...' };
//         }

//         users = await response.json();
//     } catch (err) {
//         faildTOFetch++;
//         console.log('------Fetch failed:', err.message);

//         if (faildTOFetch >= 5) {
//             faildTOFetch = 0;

//             return { status: 500, message: 'Thirdparty is offline or unreachable' };
//         }
//         console.log("ddddddd");

//         return await fetchAndStore(); // retry
//     }

//     if (users.length > 0) {
//         try {
//             await UserTempModels.insertMany(users, { ordered: false });
//         } catch (err) {
//             console.log('Some documents are duplicate:', err.message);
//         }

//         lastFetchId += users.length;
//         faildTOFetch = 0;

//         percent = parseInt((lastFetchId / 60000) * 100);
//         console.log(`Inserted batch. Total fetched: ${lastFetchId} | ${percent}%`);

//         if (percent >= 100) {
//             return { status: 200, message: 'User data fetched successfully' };
//         }

//         setTimeout(fetchAndStore, 200);
//         // return { status: 202, message: 'Fetching in progress' };
//     } else {
//         console.log('No users returned, stopping.');
//         return { status: 200, message: 'No more user data to fetch' };
//     }
// };

const fetchAndStore = async () => {
    if (isPaused) return { status: 400, message: 'Paused' };
    if (isCancel) {
            console.log("cancel", isCancel);
            lastFetchId = 1;
            percent = 0;
            faildTOFetch = 0;
            isPaused = false;
            isInRateLimit = false;
            isCancel = false;
            return { status: 401, message: 'cancel by user' };
        }
    let users = [];

    while (!isPaused && percent < 100) {
        if (isCancel) {
            console.log("cancel", isCancel);
            lastFetchId = 1;
            percent = 0;
            faildTOFetch = 0;
            isPaused = false;
            isInRateLimit = false;
            isCancel = false;
            return { status: 401, message: 'cancel by user' };
        }
        try {
            const response = await fetch(`http://localhost:3000/api/users/${lastFetchId}`);

            if (response.status === 404) {
                console.log('------No users found');
                return { status: 404, message: 'No more user data to fetch' };
            } else if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 3000;
                console.log(`------Rate limit hit, waiting ${waitTime}ms...`);
                isInRateLimit = true;
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }

            users = await response.json();
        } catch (err) {
            faildTOFetch++;
            console.log(`------Fetch failed [${faildTOFetch}/5]:`, err.message);

            if (faildTOFetch >= 5) {
                faildTOFetch = 0;
                isPaused = true;
                console.log('------Pausing due to repeated failures');
                return { status: 500, message: 'Thirdparty is offline or unreachable' };
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
        }

        if (users.length > 0) {
            try {
                await UserTempModels.insertMany(users, { ordered: false });
            } catch (err) {
                console.log('Some documents are duplicate:', err.message);
            }

            lastFetchId += users.length;
            faildTOFetch = 0;

            percent = parseInt((lastFetchId / 60000) * 100);
            console.log(`Inserted batch. Total fetched: ${lastFetchId} | ${percent}%`);

            await new Promise(resolve => setTimeout(resolve, 200));
        } else {
            console.log('No users returned, stopping.');
            break;
        }
    }

    isInRateLimit = false;
    if (isPaused) {
        return { status: 400, message: 'On Paused' };
    }

    return { status: 200, message: `User data fetched. Total: ${lastFetchId}` };
};




/**
 * Get user's data from Thirdparty API in batches
 */
const getUserTempData = async (req, res) => {
    try {

        lastFetchId = parseInt(req.params.lastFetchId || lastFetchId);
        if (!isInRateLimit) {
            console.log("INTO getUser");
            isCancel = false;
            const result = await fetchAndStore();
            console.log("result:", result);

            if (result?.status && result?.message) {
                res.status(result.status).json({ message: result.message });
            } else {
                res.status(200).json({ message: 'Started fetching' });
            }
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
};
// const getUserTempData = async (req, res) => {
//     try {
//         lastFetchId = parseInt(req.params.lastFetchId || lastFetchId);

//         interval = setInterval(async () => {
//             if (isPaused) return;
//             let users = [];

//             try {
//                 const response = await fetch(`http://localhost:3000/api/users/${lastFetchId}`);

//                 if (response.status === 404) {
//                     console.log('------No users found');
//                     clearInterval(interval);
//                     return res.status(404).json({ message: 'No more user data to fetch' });
//                 } else if (response.status === 429) {
//                     users = 'rate-limit';
//                 }

//                 users = await response.json();
//             } catch (err) {
//                 faildTOFetch++;
//                 console.log('------Thirdparty is OFFLINE or unreachable (fetch failed):', err.message);
//             }

//             if (faildTOFetch >= 5) {
//                 clearInterval(interval);
//                 res.status(500).json({ message: 'Error fetching user data' });
//             } else if (users === 'rate-limit') {
//                 console.log('Rate limit hit — On Rest');
//             } else if (users && users.length > 0) {
//                 await UserTempModels.insertMany(users);
//                 console.log(`Fetched ${users.length} users from ${lastFetchId} Thirdparty API`);

//                 lastFetchId = lastFetchId + users.length;
//                 percent = parseInt((lastFetchId / 60000) * 100);
//                 faildTOFetch = 0;
//             }

//             if (percent >= 100) {
//                 clearInterval(interval);
//             }
//         }, 500);

//         res.status(200).json({ message: 'Started fetching users' });
//     } catch (error) {
//         return res.status(500).json({ message: 'Error fetching user data' });
//     }
// };

/** 
 * pause and resume fetching user data
 */
const togglePause = async (req, res) => {
    isPaused = !isPaused;

    if (isPaused) {
        console.log('Fetching paused manually');
        //     return res.status(400).json({ message: 'Fetching paused' });
    } else {
        console.log('Fetching resumed manually');
        // Reset retry count on manual resume
        faildTOFetch = 0;
    }
    res.status(200).json({ message: 'Ok changed' });
    // await getUserTempData(req, res);

    // const result = await fetchAndStore();
    // console.log("result-resume:", result);
    // if (result?.status && result?.message) {
    //     return res.status(result.status).json({ message: result.message });
    // } else {
    //     return res.status(200).json({ message: 'Fetching resumed' });
    // }
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

        await deleteAllUserTempData(); // Clear temporary data after storing

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
        isCancel = true;
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
