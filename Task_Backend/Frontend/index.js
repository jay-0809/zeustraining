const download = document.querySelector('.download');
const progressBar = document.querySelector('.progressBar');
const buttons = document.querySelector('.buttons');
const pauseButton = document.querySelector('.pause');
const cancelButton = document.querySelector('.cancel');
const progressFill = document.querySelector('.progressFill');

let last_id = 1;
let percent = 0;
let faildTOFetch = 0;
let interval = null;
let isPaused = false;
let error = null;

const fetchData = async (last_id) => {
    try {
        const response = await fetch(`http://localhost:8080/api/user-temp/${last_id}`);
        if (response.status === 500) {
            error = 'Server error';
        } else if (response.status === 404) {
            error = 'No users found';
        } else if (response.status === 200) {
            error = '100% users fetched';
        }
        return error;

    } catch (error) {
        return error;
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
deleteUsers();

const downloading = async () => {
    interval = setInterval(async () => {
        progressFill.style.width = `${percent}%`;
        progressFill.innerHTML = `${percent}%`;
        progressFill.style.textAlign = 'right';
        progressFill.style.fontWeight = 'bold';
        progressFill.style.paddingRight = '5px';

        try {
            const u = await fetch(`http://localhost:8080/api/user-temp`);

            const data = await u.json();
            percent = parseInt((data.length / 60000) * 100);
        } catch (error) {
            // console.error('Error fetching user data:', error);
            faildTOFetch++;
            if (faildTOFetch >= 5) {
                clearInterval(interval);
                progressFill.innerHTML = `Failed to fetch data after ${faildTOFetch} attempts`;
                return;
            }
        }

        if (percent >= 100) {
            const confirmTransfer = window.confirm("Are you sure you want to transfer to Main?");
            if (!confirmTransfer) {
                return;
            }
            // await fetch(`http://localhost:8080/api/user-temp/store`, {
            //     method: 'POST'
            // });
            progressFill.innerHTML = `Download Complete ${percent}%`;
            progressFill.style.textAlign = 'center';
            download.innerText = 'Download Complete';
            buttons.style.display = 'none';
            download.style.display = 'flex';
            download.style.backgroundColor = 'green';
            clearInterval(interval);
            return;
        }
    }, 1000);
};

downloading();

download.addEventListener('pointerdown', async () => {
    download.style.display = 'none';
    buttons.style.display = 'flex';

    progressBar.style.display = 'flex';
    progressBar.style.alignItems = 'center';
    progressBar.style.justifyContent = 'center';
    progressBar.style.marginTop = '20px';

    const e = await fetchData(last_id);
    // console.log(`Fetched Error: ${e}`);
});

pauseButton.addEventListener('pointerdown', async () => {
    if (pauseButton.innerText === 'Pause') {
        await fetch(`http://localhost:8080/api/user-temp/pause`, {
            method: 'POST'
        });
        clearInterval(interval);
        interval = null;
        isPaused = true;
        pauseButton.innerText = 'Resume Download';
        pauseButton.style.backgroundColor = '#0056b3';
    } else {
        await fetch(`http://localhost:8080/api/user-temp/pause`, {
            method: 'POST'
        });
        isPaused = false;
        pauseButton.innerText = 'Pause';
        pauseButton.style.backgroundColor = '#f0ad4e';
        faildTOFetch = 0;
        downloading();
    }
});

cancelButton.addEventListener('pointerdown', () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel the download?");
    if (!confirmCancel) {
        return;
    }

    clearInterval(interval);
    deleteUsers();
    interval = null;
    last_id = 1;
    percent = 0;
    faildTOFetch = 0;
    isPaused = false;

    progressBar.innerHTML = `Download Cancelled`;
    progressBar.style.display = 'flex';
    progressFill.style.width = `${percent}%`;
    progressFill.innerHTML = `${percent}%`;
    buttons.style.display = 'none';
    download.style.display = 'flex';
});