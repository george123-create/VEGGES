// ======================================
// VEGGES LOGIN SYSTEM
// ======================================

const LOGIN_API_URL = "https://vegges.onrender.com/api";

const loginForm =
    document.getElementById("loginForm");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const loginNotification =
    document.getElementById("loginNotification");


// ======================================
// SHOW / HIDE PASSWORD
// ======================================

if (togglePassword && passwordInput) {

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

}


// ======================================
// LOGIN FORM
// ======================================

if (loginForm) {

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


        const loginButton =
            document.getElementById("loginButton");


        // ==================================
        // DISABLE LOGIN BUTTON
        // ==================================

        loginButton.disabled = true;

        loginButton.textContent =
            "Logging in...";


        try {

            // ==================================
            // SEND LOGIN REQUEST
            // ==================================

            const response = await fetch(
                `${LOGIN_API_URL}/users/login`,
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


            console.log(
                "Login Response:",
                data
            );


            // ==================================
            // LOGIN SUCCESS
            // ==================================

            if (data.success) {


                // ==================================
                // GET JWT TOKEN
                // ==================================

                const token =
                    data.token ||
                    data.accessToken;


                if (!token) {

                    console.error(
                        "Login response does not contain a token:",
                        data
                    );

                    alert(
                        "Login successful, but authentication token was not received."
                    );

                    loginButton.disabled = false;

                    loginButton.textContent =
                        "Login";

                    return;
                }


                // ==================================
                // SAVE JWT TOKEN
                // ==================================

                localStorage.setItem(
                    "token",
                    token
                );


                // ==================================
                // SAVE USER DETAILS
                // ==================================

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                // ==================================
                // VERIFY STORAGE
                // ==================================

                console.log(
                    "TOKEN SAVED:",
                    localStorage.getItem("token")
                );

                console.log(
                    "USER SAVED:",
                    localStorage.getItem("user")
                );


                console.log(
                    "Login successful:",
                    data.user
                );


                // ==================================
                // SHOW SUCCESS NOTIFICATION
                // ==================================

                if (loginNotification) {

                    loginNotification.classList.add(
                        "show"
                    );

                }


                // ==================================
                // GO TO HOME
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

                loginButton.textContent =
                    "Login";

            }


        } catch (error) {


            // ==================================
            // LOGIN ERROR
            // ==================================

            console.error(
                "Login Error:",
                error
            );


            alert(
                "Unable to connect to server. Please try again."
            );


            loginButton.disabled = false;

            loginButton.textContent =
                "Login";

        }

    });

}