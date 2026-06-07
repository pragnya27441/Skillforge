import { database, ref, get, child } from './firebase.js';

const loginBtn = document.getElementById("doLogin");
const loginError = document.getElementById("loginError");

loginBtn.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        loginError.textContent = "Please enter email and password";
        return;
    }

    const userId = email.replace(/\./g, "_");

    get(child(ref(database), 'users/' + userId))
    .then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.password === password) {
                loginError.textContent = "";
                alert("Login successful!");
                 localStorage.setItem('loggedInEmail', email);
                window.location.href = "index.html";
            } else {
                loginError.textContent = "Incorrect password!";
            }
        } else {
            loginError.textContent = "User not found!";
        }
    }).catch(() => {
        loginError.textContent = "Error reading database!";
    });
});
