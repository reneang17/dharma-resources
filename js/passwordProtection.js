

function checkPassword() {
    const passwordInput = document.getElementById('password').value;
    const correctPasswords = ['be kind to yourself', 'kind', 'gate']; // Add your list of passwords here
    const content = document.getElementById('protected-content');

    if (correctPasswords.includes(passwordInput)) {
        content.style.display = 'block';
        document.getElementById('password-section').style.display = 'none';
    } else {
        alert('Incorrect password. Please try again.');
    }
}