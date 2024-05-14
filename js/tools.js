function generateRandomLink() {
    // Define the range of pages
    const minPage = 21;
    const maxPage = 172;

    // Generate a random page number within the range
    const randomPage = Math.floor(Math.random() * (maxPage - minPage + 1)) + minPage;

    // Construct the URL with the random page
    const url = `https://reneang17.github.io/dharma-resources/ajahn_munindo_books/dhammapada-for-contemplation-5th-LARGE-WEB-2017-02-05.pdf#page=${randomPage}`;

    // Update the href attribute of the link and modify the link text
    const link = document.getElementById('randomPageLink');
    link.href = url;
    link.textContent = `Link to page ${(randomPage - 18)}`;
    link.style.display = 'inline'; // Make the link visible
}

async function fetchVerseDetails() {
    const verseInput = document.getElementById('verseNumber');
    const verseId = verseInput.value;
    if (verseId < 1 || verseId > 423) {
        alert('Please enter a valid verse number between 1 and 423.');
        return;
    }

    try {
        const response = await fetch('./ajahn_munindo_books/data.json');
        if (!response.ok) {
            throw new Error('Failed to fetch verse details.');
        }
        const verses = await response.json();
        console.log('gato')
        displayVerseDetails(verses.find(verse => verse.id === parseInt(verseId)));
    } catch (error) {
        console.error('Error fetching verse details:', error);
        alert('Error fetching data. Please try again.');
    }
}


function displayVerseDetails(verse) {
    if (!verse) {
        alert('Verse details not found.');
        return;
    }

    const detailsContainer = document.getElementById('verseDetails');
    detailsContainer.innerHTML = `
        <p>${verse.utter}</p>
        <p>The historical context of this verse is provided by tipitaka.net at:</p>
        <ul>${verse.context.map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`).join('')}</ul>
        <p>Available Ajahn Munindo's reflexions on this verse:</p>
        <ul>${verse.refs.map((ref, index) =>
        `<li><a href="${verse.urls[index]}" target="_blank">${ref}</a></li>`).join('')}
        </ul>
    `;
}





