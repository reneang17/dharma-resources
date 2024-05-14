
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
    let htmlContent = `
        <p>${verse.utter}</p>
        <p>The historical context of this verse is provided by tipitaka.net at:</p>
        <ul>${verse.context.map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`).join('')}</ul>
        <p>Available Ajahn Munindo's reflections on this verse:</p>
        <ul>
    `;

    verse.refs.forEach((ref, index) => {
        const url = verse.urls[index];
        const viewerId = `pdf-viewer-${index}`;
        if (url.includes('.pdf')) {
            htmlContent += `<li><button onclick="loadPDF('${url}', '${viewerId}')">${ref}</button><div id="${viewerId}" class="pdf-viewer-container"></div></li>`;
        } else {
            htmlContent += `<li><a href="${url}" target="_blank">${ref}</a></li>`;
        }
    });

    htmlContent += `</ul>`;
    detailsContainer.innerHTML = htmlContent;
}

// Function to instantiate and load a PDF viewer
function loadPDF(url, containerId) {
    const pageMatch = url.match(/#page=(\d+)/);
    const pageNum = pageMatch ? pageMatch[1] : 1;
    new CommentsViewer(containerId, url, pageNum).init();
}




