
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
        <p>The history of this verse can be found at:</p>
        <ul>${verse.context.map(url => `<li><a href="${url}" target="_blank">${"This link of tipitaka.net"}</a></li>`).join('')}</ul>
        <p>Available Ajahn Munindo's reflections on this verse:</p>
        <ul>
    `;

    verse.refs.forEach((ref, index) => {
        const url = verse.urls[index];
        const viewerId = `pdf-viewer-${index}`;
        if (url.includes('.pdf')) {
            htmlContent += `<li>${ref} <label class="switch toggle-button"><input type="checkbox" onchange="togglePDF(this.checked, '${url}', '${viewerId}')"><span class="slider round"></span></label><div id="${viewerId}" class="pdf-viewer-container" style="display:none;"></div></li>`;
        } else {
            htmlContent += `<li>${ref} <a href="${url}" target="_blank">(Link)</a></li>`;
        }
    });

    htmlContent += `</ul>`;
    detailsContainer.innerHTML = htmlContent;
}


// Function to toggle the PDF viewer based on switch state
function togglePDF(isChecked, url, containerId) {
    if (isChecked) {
        loadPDF(url, containerId);
    } else {
        hidePDF(containerId);
    }
}

// Function to load the PDF viewer
function loadPDF(url, containerId) {
    const pageMatch = url.match(/#page=(\d+)/);
    const pageNum = pageMatch ? pageMatch[1] : 1;
    new CommentsViewer(containerId, url, pageNum).init();
    document.getElementById(containerId).style.display = 'block';
}

// Function to hide the PDF viewer
function hidePDF(containerId) {
    document.getElementById(containerId).style.display = 'none';
}