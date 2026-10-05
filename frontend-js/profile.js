// ======================================
// VEGGES - PROFILE PAGE
// ======================================

document.addEventListener("DOMContentLoaded", async () => {

    // ======================================
    // GET LOGIN TOKEN
    // ======================================

    const token = localStorage.getItem("token");

    // ======================================
    // CHECK LOGIN
    // ======================================

    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }


    // ======================================
    // GET ELEMENTS
    // ======================================

    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const userPhone = document.getElementById("userPhone");
    const userAddress = document.getElementById("userAddress");

    const editName = document.getElementById("editName");
    const editEmail = document.getElementById("editEmail");
    const editPhone = document.getElementById("editPhone");
    const editAddress = document.getElementById("editAddress");

    const editProfileBtn =
        document.getElementById("editProfileBtn");

    const saveProfileBtn =
        document.getElementById("saveProfileBtn");

    const cancelEditBtn =
        document.getElementById("cancelEditBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const logoutBtn2 =
        document.getElementById("logoutBtn2");


    // ======================================
    // INITIAL EDIT MODE
    // ======================================

    function setEditMode(enabled) {

        if (enabled) {

            editName.style.display = "block";
            editEmail.style.display = "block";
            editPhone.style.display = "block";
            editAddress.style.display = "block";

            userName.style.display = "none";
            userEmail.style.display = "none";
            userPhone.style.display = "none";
            userAddress.style.display = "none";

            editProfileBtn.style.display = "none";
            saveProfileBtn.style.display = "block";
            cancelEditBtn.style.display = "block";

        } else {

            editName.style.display = "none";
            editEmail.style.display = "none";
            editPhone.style.display = "none";
            editAddress.style.display = "none";

            userName.style.display = "block";
            userEmail.style.display = "block";
            userPhone.style.display = "block";
            userAddress.style.display = "block";

            editProfileBtn.style.display = "block";
            saveProfileBtn.style.display = "none";
            cancelEditBtn.style.display = "none";
        }
    }


    // ======================================
    // LOAD PROFILE
    // ======================================

    async function loadProfile() {

        try {

            const response = await fetch(
                `${API_URL}/users/profile`,
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log("Profile API response:", data);


            // ======================================
            // CHECK RESPONSE
            // ======================================

            if (!response.ok || !data.success) {

                alert(
                    data.message ||
                    "Unable to load profile."
                );

                if (response.status === 401) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    window.location.href = "login.html";
                }

                return;
            }


            // ======================================
            // GET USER DATA
            // ======================================

            const user = data.user;


            // ======================================
            // DISPLAY PROFILE
            // ======================================

            userName.textContent =
                user.name || "Not available";

            userEmail.textContent =
                user.email || "Not available";

            userPhone.textContent =
                user.phone || "Not available";

            userAddress.textContent =
                user.address || "Not available";


            // ======================================
            // PUT VALUES INTO EDIT FIELDS
            // ======================================

            editName.value =
                user.name || "";

            editEmail.value =
                user.email || "";

            editPhone.value =
                user.phone || "";

            editAddress.value =
                user.address || "";


            // ======================================
            // SAVE USER TO LOCAL STORAGE
            // ======================================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            // ======================================
            // START IN NORMAL VIEW
            // ======================================

            setEditMode(false);

        } catch (error) {

            console.error(
                "Profile loading error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );
        }
    }


    // ======================================
    // EDIT PROFILE
    // ======================================

    if (editProfileBtn) {

        editProfileBtn.addEventListener(
            "click",
            () => {

                setEditMode(true);

                editName.focus();
            }
        );
    }


    // ======================================
    // CANCEL EDIT
    // ======================================

    if (cancelEditBtn) {

        cancelEditBtn.addEventListener(
            "click",
            () => {

                setEditMode(false);

                loadProfile();
            }
        );
    }


    // ======================================
    // SAVE PROFILE
    // ======================================

    if (saveProfileBtn) {

        saveProfileBtn.addEventListener(
            "click",
            async () => {

                const name =
                    editName.value.trim();

                const phone =
                    editPhone.value.trim();

                const address =
                    editAddress.value.trim();


                // ======================================
                // CHECK NAME
                // ======================================

                if (!name) {

                    alert("Name cannot be empty.");

                    editName.focus();

                    return;
                }


                // ======================================
                // CHECK PHONE
                // ======================================

                if (!phone) {

                    alert("Phone number cannot be empty.");

                    editPhone.focus();

                    return;
                }


                // ======================================
                // CHECK ADDRESS
                // ======================================

                if (!address) {

                    alert("Address cannot be empty.");

                    editAddress.focus();

                    return;
                }


                try {

                    saveProfileBtn.disabled = true;

                    saveProfileBtn.textContent =
                        "Saving...";


                    // ======================================
                    // UPDATE PROFILE API
                    // ======================================

                    const response = await fetch(
                        `${API_URL}/users/profile`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                name: name,
                                phone: phone,
                                address: address
                            })
                        }
                    );


                    const data =
                        await response.json();

                    console.log(
                        "Update Profile API response:",
                        data
                    );


                    // ======================================
                    // CHECK UPDATE RESPONSE
                    // ======================================

                    if (!response.ok || !data.success) {

                        alert(
                            data.message ||
                            "Unable to update profile."
                        );

                        return;
                    }


                    // ======================================
                    // UPDATE LOCAL STORAGE
                    // ======================================

                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );


                    // ======================================
                    // UPDATE DISPLAY
                    // ======================================

                    userName.textContent =
                        data.user.name ||
                        "Not available";

                    userEmail.textContent =
                        data.user.email ||
                        "Not available";

                    userPhone.textContent =
                        data.user.phone ||
                        "Not available";

                    userAddress.textContent =
                        data.user.address ||
                        "Not available";


                    // ======================================
                    // RETURN TO NORMAL MODE
                    // ======================================

                    setEditMode(false);


                    alert(
                        "Profile updated successfully!"
                    );


                } catch (error) {

                    console.error(
                        "Update profile error:",
                        error
                    );

                    alert(
                        "Unable to connect to the server."
                    );

                } finally {

                    saveProfileBtn.disabled = false;

                    saveProfileBtn.textContent =
                        "Save Changes";
                }
            }
        );
    }


    // ======================================
    // LOGOUT FUNCTION
    // ======================================

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Logged out successfully!");

        window.location.href =
            "login.html";
    }


    // ======================================
    // NAVBAR LOGOUT
    // ======================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            logout
        );
    }


    // ======================================
    // PROFILE LOGOUT
    // ======================================

    if (logoutBtn2) {

        logoutBtn2.addEventListener(
            "click",
            logout
        );
    }


    // ======================================
    // LOAD PROFILE ON PAGE OPEN
    // ======================================

    await loadProfile();

});