const download = document.querySelector('.download');
const progressBar = document.querySelector('.progressBar');

// // Helper function to download JSON as file
// function downloadJSON(data, filename = 'users.json') {
//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement('a');
//     a.href = url;
//     a.download = filename;
//     a.click();

//     URL.revokeObjectURL(url);
// }

const fetchData = async (last_id) => {
    // Fetch real data from backend
    const response = await fetch(`http://localhost:3000/api/users/${last_id}`);
    // if (!response.ok) throw new Error('Failed to fetch data');
    if (!response.ok) return;

    const users = await response.json();

    // Download the file
    // downloadJSON(users);
    return users;
}

download.addEventListener('click', async () => {
    download.innerText = 'Downloading...';

    progressBar.style.display = 'flex';
    progressBar.style.alignItems = 'center';
    progressBar.style.justifyContent = 'center';
    progressBar.style.marginTop = '20px';
    progressBar.style.color = 'blue';
    progressBar.style.fontWeight = 'bold';

    try {
        // Simulate progress visually
        let last_id = 1;
        let percent = 0;
        const interval = setInterval(async () => {
            if (percent >= 100) {
                clearInterval(interval);
                progressBar.innerHTML = `Download Complete`;
                download.innerText = 'Download Complete';
                download.style.backgroundColor = 'green';
            } else {
                progressBar.innerHTML = `Progressing... ${percent}%`;
                const u = await fetchData(last_id);
                if(u){
                    // console.log(u);
                    last_id += u.length;
                }else{
                    console.error('On Rest!');
                }
                percent = parseInt(last_id/60000 * 100);
            }
        }, 100);
    } catch (error) {
        progressBar.innerHTML = `Error: ${error.message}`;
        download.innerText = 'Download Failed';
        download.style.backgroundColor = 'red';
    }
});
