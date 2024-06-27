function checkPassword() {
    const passwordInput = document.getElementById('password').value;
    const correctPassword = 'gate';
    const content = document.getElementById('protected-content');

    if (passwordInput === correctPassword) {
        content.style.display = 'block';
        document.getElementById('password-section').style.display = 'none';
    } else {
        alert('Incorrect password. Please try again.');
    }
}
