javascript
const REGISTER_API_URL = "https://vegges.onrender.com/api";

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        console.error("Registration form not found: registerForm");
        return;
    }

    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim().toLowerCase();
        const password = document.getElementById("password")?.value;
        const confirmPassword = document.getElementById("confirmPassword")?.value;

        // Validate required fields
        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        // Validate password confirmation
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Prevent duplicate submissions
        const submitButton = registerForm.querySelector('button[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Registering...";
        }

        try {
            const response = await fetch(
                `${REGISTER_API_URL}/users/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json().catch(() => ({}));

            console.log("Registration status:", response.status);
            console.log("Registration response:", data);

            if (response.ok) {
                alert("Registration successful! Please log in.");
                window.location.href = "login.html";
            } else {
                alert(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("Unable to connect to the server. Please try again.");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Register";
            }
        }
    });
});
