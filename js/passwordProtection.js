function checkPassword() {
    const passwordInput = document.getElementById('password').value;
    const correctPasswords = ['be kind to yourself', 'gate']; // Add your list of passwords here

    if (correctPasswords.includes(passwordInput)) {
        alert('Password is correct.');
    } else {
        alert('Incorrect password. Please try again.');
    }
}