function setHeaderImage() {
    const headerImage = document.getElementById('headerImage');
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 10) {
        headerImage.src = "assets/pexels-soumenmaity-634770_top.jpg"; // Replace with your morning image path
    }
    else if (currentHour >= 19) {
        headerImage.src = "assets/pexels-photo-239107.jpeg";
    }
    else {
        headerImage.src = "assets/prayer-flags.jpg"; // Replace with your evening image path
    }
}

// Call the function when the page loads
window.onload = setHeaderImage;
