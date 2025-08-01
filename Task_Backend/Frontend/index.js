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

const fetchData = async (last_id) => {
    try {
        const response = await fetch(`http://localhost:8080/api/users/${last_id}`);
        if (response.status === 500) {
            throw new Error('Server error');
        } else if (response.status === 404) {
            console.log('No users found');
            return [];
        } else if (response.status === 429) {
            return 'rate-limit';
        }

        // if (!response.ok) return null;
        const users = await response.json();
        return users;

    } catch (error) {
        // console.error('Fetch error:', error.message);
        return null;
    }
};

const deleteUsers = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/users', {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete users');
        console.log('All users deleted successfully');
    } catch (error) {
        console.error('Error deleting users:', error);
    }
}
deleteUsers();

const downloading = () => {
    download.style.display = 'none';
    buttons.style.display = 'flex';

    progressBar.style.display = 'none';
    progressBar.style.alignItems = 'center';
    progressBar.style.justifyContent = 'center';
    progressBar.style.marginTop = '20px';

    interval = setInterval(async () => {
        progressFill.style.width = `${percent}%`;
        progressFill.innerHTML = `${percent}%`;
        progressFill.style.textAlign = 'right';
        progressFill.style.fontWeight = 'bold';
        progressFill.style.paddingRight = '5px';

        if (faildTOFetch >= 5) {
            clearInterval(interval);
            progressBar.style.display = 'flex';
            progressBar.innerHTML = `Failed to fetch data after multiple attempts`;
            pauseButton.innerText = 'Resume Download';
            pauseButton.style.backgroundColor = '#0056b3';
            return;
        } else if (percent >= 100) {
            clearInterval(interval);
            progressFill.innerHTML = `Download Complete ${percent}%`;
            progressFill.style.textAlign = 'center';
            download.innerText = 'Download Complete';
            buttons.style.display = 'none';
            download.style.display = 'flex';
            download.style.backgroundColor = 'green';
            return;
        }

        const u = await fetchData(last_id);
        if (u === 'rate-limit') {
            console.log('Rate limit hit — On Rest');
            return;
        } else if (u && u.length > 0) {
            last_id += u.length;
            percent = parseInt((last_id / 60000) * 100);
            faildTOFetch = 0;
        } else if (u === null) {
            faildTOFetch++;
            console.warn(`Fetch failed (${faildTOFetch} times)`);
        }
    }, 100);
};

download.addEventListener('pointerdown', () => {
    if (!interval && !isPaused) {
        downloading();
    }
});

pauseButton.addEventListener('pointerdown', () => {
    if (pauseButton.innerText === 'Pause') {
        clearInterval(interval);
        interval = null;
        isPaused = true;
        pauseButton.innerText = 'Resume Download';
        pauseButton.style.backgroundColor = '#0056b3';
    } else {
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