import { database, ref, set, get, child } from './firebase.js';

const doRegisterBtn = document.getElementById('doRegister');
const regError = document.getElementById('regError');

doRegisterBtn.addEventListener('click', () => {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (!name || !email || !password || !confirmPassword) {
        regError.textContent = "All fields are required!";
        return;
    }

    if (password !== confirmPassword) {
        regError.textContent = "Passwords do not match!";
        return;
    }

    const userId = email.replace(/\./g, "_");

    get(child(ref(database), 'users/' + userId))
    .then((snapshot) => {
        if (snapshot.exists()) {
            regError.textContent = "User already exists!";
        } else {
            set(ref(database, 'users/' + userId), {
                name: name,
                email: email,
                password: password
            }).then(() => {
                alert("Account created successfully! You can now login.");
                window.location.href = "login.html";
            }).catch(() => {
                regError.textContent = "Error saving data!";
            });
        }
    }).catch(() => {
        regError.textContent = "Error reading database!";
    });
});
