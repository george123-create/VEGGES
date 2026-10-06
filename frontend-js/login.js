// ======================================
// VEGGES LOGIN SYSTEM
// ======================================
const loginForm = document.getElementById("loginForm");

const passwordInput = document.getElementById("password");


const togglePassword =
    document.getElementById("togglePassword");

const loginNotification =
    document.getElementById("loginNotification");





// ======================================
// SHOW / HIDE PASSWORD - EYE BUTTON
// ======================================

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        this.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        passwordInput.type = "password";

        this.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});


// ======================================
// LOGIN FORM
// ======================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    const email =
        document.getElementById("email")
            .value
            .trim();


    const password =
        document.getElementById("password")
            .value
            .trim();


    // ==================================
    // DISABLE LOGIN BUTTON
    // ==================================

    const loginButton =
        document.getElementById("loginButton");

    loginButton.disabled = true;

    loginButton.textContent = "Logging in...";


    try {

        // ==================================
        // SEND LOGIN REQUEST
        // ==================================

        const response = await fetch(
            `${API_URL}/users/login`,
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


        const data =
            await response.json();


        console.log("Login Response:", data);


        // ==================================
        // LOGIN SUCCESS
        // ==================================

        if (data.success) {


            // Save JWT Token

            localStorage.setItem(
                "token",
                data.token
            );


            // Save User Details

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            console.log(
                "Login successful:",
                data.user
            );


            // ==================================
            // SHOW SUCCESS NOTIFICATION
            // ==================================

            loginNotification.classList.add(
                "show"
            );


            // ==================================
            // GO TO HOME AFTER 1 SECOND
            // ==================================

            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 1000);


        } else {


            // ==================================
            // LOGIN FAILED
            // ==================================

            alert(
                data.message ||
                "Invalid email or password."
            );


            loginButton.disabled = false;

            loginButton.textContent = "Login";

        }


    } catch (error) {


        console.error(
            "Login Error:",
            error
        );


        alert(
            "Unable to connect to server. Please try again."
        );


        loginButton.disabled = false;

        loginButton.textContent = "Login";

    }

});