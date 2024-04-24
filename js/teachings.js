async function generateRandomSanghaLink() {
    try {
        const response = await fetch('./open_sangha_and_maitri/settle.json');  // Ensure the path matches your JSON file location
        if (!response.ok) {
            throw new Error('Failed to fetch sangha links.');
        }
        const links = await response.json();
        const randomIndex = Math.floor(Math.random() * links.length);
        const randomLink = links[randomIndex].settle;

        const linkContainer = document.getElementById('linkContainer');
        linkContainer.innerHTML = '';  // Clear previous links if any

        const linkElement = document.createElement('a');
        linkElement.href = randomLink;
        linkElement.textContent = 'Open sangha link';
        linkElement.target = '_blank';
        linkContainer.appendChild(linkElement);
    } catch (error) {
        console.error('Error fetching sangha links:', error);
        alert('Error fetching links. Please try again.');
    }
}


async function generateRandomMaitriLink() {
    try {
        const response = await fetch('./open_sangha_and_maitri/maitri.json');  // Ensure the path matches your JSON file location
        if (!response.ok) {
            throw new Error('Failed to fetch maitri links.');
        }
        const links = await response.json();
        const randomIndex = Math.floor(Math.random() * links.length);
        const randomLink = links[randomIndex].maitri;

        const linkContainer = document.getElementById('linkContainer');
        linkContainer.innerHTML = '';  // Clear previous links if any

        const linkElement = document.createElement('a');
        linkElement.href = randomLink;
        linkElement.textContent = 'Maitri link';
        linkElement.target = '_blank';
        linkContainer.appendChild(linkElement);
    } catch (error) {
        console.error('Error fetching maitri links:', error);
        alert('Error fetching links. Please try again.');
    }
}