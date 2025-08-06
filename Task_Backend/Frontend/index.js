const download = document.querySelector('.download');
const progressBar = document.querySelector('.progressBar');
const buttons = document.querySelector('.buttons');
const pauseButton = document.querySelector('.pause');
const cancelButton = document.querySelector('.cancel');
const progressFill = document.querySelector('.progressFill');
const refreshButton = document.querySelector('.refresh');

let last_id = 1;
let percent = 0;
let faildTOFetch = 0;
let interval = null;
let isPaused = false;
let error = null;
let data = null;

const fetchData = async () => {
    try {
        console.log(`into fetchData ${last_id}`);

        const response = await fetch(`http://localhost:8080/api/user-temp/${last_id}`);
        const result = await response.json();
        await currentTempData();
        if (response.status === 500 || response.status === 400) {
            error = result.message;
            last_id = data ? data.length + 1 : 1; // update last_id for resume
            console.log(last_id, "----", isPaused);

            pauseButton.innerText = 'Resume Download';
            pauseButton.style.backgroundColor = '#0056b3';
            clearInterval(interval);
            interval = null;
            isPaused = true;
        } else if (response.status === 404) {
            error = result.message;
        } else if (response.status === 200) {
            error = result.message;
        }
        return error;

    } catch (error) {
        return error;
    }
};

const currentTempData = async () => {
    try{
        const u = await fetch(`http://localhost:8080/api/user-temp`);
        data = await u.json();
    } catch(error){
        console.error(error);
    }
};

const deleteUsers = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/user-temp', {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete users');
        console.log('All users deleted successfully');
    } catch (error) {
        console.error('Error deleting users:', error);
    }
}

const downloading = async () => {
    interval = setInterval(async () => {
        try {
            await currentTempData();
            percent = parseInt((data.length / 60000) * 100);
        } catch (error) {
            // console.error('Error fetching user data:', error);
            faildTOFetch++;
            if (faildTOFetch >= 5) {
                progressFill.innerHTML = `Failed to fetch data after ${faildTOFetch} attempts`;
                return;
            }
        }
        progressFill.style.width = `${percent}%`;
        progressFill.innerHTML = `${percent}%`;
        progressFill.style.textAlign = 'right';
        progressFill.style.fontWeight = 'bold';
        progressFill.style.paddingRight = '5px';

        if (percent >= 100) {
            progressFill.style.width = `${percent}%`;
            progressFill.innerHTML = `Download Complete ${percent}%`;
            refreshButton.style.display = 'none';
            progressFill.style.textAlign = 'center';
            download.innerText = 'Download Complete';
            buttons.style.display = 'none';
            download.style.display = 'flex';
            download.style.backgroundColor = 'green';

            await fetch(`http://localhost:8080/api/user-temp/store`, {
                method: 'POST'
            });

            clearInterval(interval);
            interval = null;
            return;
        }
    }, 20000);
};

refreshButton.addEventListener('pointerdown', async () => { downloading(); });

download.addEventListener('pointerdown', async () => {
    download.style.display = 'none';
    buttons.style.display = 'flex';

    progressBar.style.display = 'none';
    progressBar.style.alignItems = 'center';
    progressBar.style.justifyContent = 'center';
    progressBar.style.marginTop = '20px';

    const e = await fetchData();
    console.log(`Fetched Error: ${e}`);

    downloading();
});

pauseButton.addEventListener('pointerdown', async () => {
    try {
        await fetch(`http://localhost:8080/api/user-temp/pause`, {
            method: 'POST'
        });
    } catch (err) {
        console.error("Pause API failed:", err);
    }
    await currentTempData();
    if (pauseButton.innerText === 'Resume Download') {
        console.log("RESUME");
        // Resume
        isPaused = false;
        pauseButton.innerText = 'Pause';
        pauseButton.style.backgroundColor = '#f0ad4e';
        faildTOFetch = 0;
        last_id = data ? data.length + 1 : 1;
        const e = await fetchData();  // fetch with updated last_id
        console.log(`Resumed Fetch ${last_id} ${e}`);

        downloading();  // resume polling
    } else {
        console.log("PAUSE");
        // Pause
        clearInterval(interval);
        interval = null;
        isPaused = true;
        pauseButton.innerText = 'Resume Download';
        pauseButton.style.backgroundColor = '#0056b3';
    }
});


cancelButton.addEventListener('pointerdown', () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel the download?");
    if (!confirmCancel) {
        return;
    }
    clearInterval(interval);
    interval = null;
    last_id = 1;
    percent = 0;
    faildTOFetch = 0;
    isPaused = false;
    deleteUsers();

    progressBar.innerHTML = `Download Cancelled`;
    progressBar.style.display = 'flex';
    progressFill.style.width = `${percent}%`;
    progressFill.innerHTML = `${percent}%`;
    pauseButton.innerText = 'Pause';
    pauseButton.style.backgroundColor = '#f0ad4e';
    buttons.style.display = 'none';
    download.style.display = 'flex';
});