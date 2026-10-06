// ================================
// VEGGES REGISTER
// ================================
const API_URL = "https://vegges.onrender.com/api";
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    const confirmPassword = document.getElementById("confirmPassword").value.trim();


    if(password !== confirmPassword){

        alert("Passwords do not match");

        return;
    }


    try {

        const response = await fetch(`${API_URL}/users/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name,
                email,
                password

            })

        });


        const data = await response.json();


        console.log(data);


        if(data.success){

            alert("Registration successful!");

            window.location.href = "login.html";

        }
        else{

            alert(data.message);

        }


    }
    catch(error){

        console.log(error);

        alert("Server error");

    }


});