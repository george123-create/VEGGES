// ======================================
// VEGGES - ADMIN LOGIN
// ======================================

const adminLoginForm = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginMessage = document.getElementById("loginMessage");
const loginButton = document.getElementById("loginButton");


// ======================================
// SHOW / HIDE PASSWORD
// ======================================

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.textContent = "Hide";

    } else {

        passwordInput.type = "password";

        togglePassword.textContent = "Show";
    }
});


// ======================================
// ADMIN LOGIN
// ======================================

adminLoginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();


    // Clear previous message
    loginMessage.textContent = "";
    loginMessage.className = "login-message";


    // Disable button
    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";


    try {

        const response = await fetch(
            "http://localhost:5000/api/users/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        // ======================================
        // LOGIN FAILED
        // ======================================

        if (!response.ok) {

            loginMessage.textContent =
                data.message || "Login failed";

            loginMessage.className =
                "login-message error";

            return;
        }


        // ======================================
        // CHECK ADMIN ROLE
        // ======================================

        if (!data.user || data.user.role !== "admin") {

            loginMessage.textContent =
                "Access denied. Admin account required.";

            loginMessage.className =
                "login-message error";

            return;
        }


        // ======================================
        // SAVE ADMIN LOGIN
        // ======================================

        localStorage.setItem(
            "adminToken",
            data.token
        );

        localStorage.setItem(
            "adminUser",
            JSON.stringify(data.user)
        );


        // ======================================
        // SUCCESS
        // ======================================

        loginMessage.textContent =
            "Login successful! Redirecting...";

        loginMessage.className =
            "login-message success";


        // Redirect to dashboard
        setTimeout(() => {

            window.location.href =
                "admin-dashboard.html";

        }, 800);


    } catch (error) {

        console.error("Admin login error:", error);

        loginMessage.textContent =
            "Unable to connect to server.";

        loginMessage.className =
            "login-message error";

    } finally {

        loginButton.disabled = false;

        loginButton.textContent =
            "Login to Admin Panel";
    }

});