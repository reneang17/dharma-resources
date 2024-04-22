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
    link.textContent = `Link to page ${randomPage}`;
    link.style.display = 'inline'; // Make the link visible
}
