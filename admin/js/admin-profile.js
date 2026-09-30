/* ======================================
   VEGGES - ADMIN PROFILE
====================================== */

const API_URL = "http://localhost:5000/api";


/* =========================
   ELEMENTS
========================= */

const sidebar =
    document.getElementById("sidebar");

const menuBtn =
    document.getElementById("menuBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


const profileForm =
    document.getElementById("profileForm");

const passwordForm =
    document.getElementById("passwordForm");


const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profilePhone =
    document.getElementById("profilePhone");

const profileAddress =
    document.getElementById("profileAddress");

const profileRole =
    document.getElementById("profileRole");

const profileJoined =
    document.getElementById("profileJoined");


const profileDisplayName =
    document.getElementById(
        "profileDisplayName"
    );

const topAdminName =
    document.getElementById(
        "topAdminName"
    );


const profileMessage =
    document.getElementById(
        "profileMessage"
    );


const saveProfileBtn =
    document.getElementById(
        "saveProfileBtn"
    );

const cancelProfileBtn =
    document.getElementById(
        "cancelProfileBtn"
    );


const currentPassword =
    document.getElementById(
        "currentPassword"
    );

const newPassword =
    document.getElementById(
        "newPassword"
    );

const confirmPassword =
    document.getElementById(
        "confirmPassword"
    );

const changePasswordBtn =
    document.getElementById(
        "changePasswordBtn"
    );

const cancelPasswordBtn =
    document.getElementById(
        "cancelPasswordBtn"
    );


/* =========================
   ADMIN TOKEN
========================= */

const adminToken =
    localStorage.getItem(
        "adminToken"
    );


if (!adminToken) {

    window.location.href =
        "admin-login.html";

}


/* =========================
   MESSAGE
========================= */

function showMessage(
    message,
    type
) {

    profileMessage.textContent =
        message;

    profileMessage.className =
        "profile-message " + type;

}


function clearMessage() {

    profileMessage.textContent =
        "";

    profileMessage.className =
        "profile-message";

}


/* =========================
   DATE FORMAT
========================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "Not available";
    }

    const date =
        new Date(dateValue);

    if (isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================
   LOAD PROFILE
========================= */

async function loadProfile() {

    try {

        const response =
            await fetch(
                `${API_URL}/users/profile`,
                {
                    method: "GET",
                    headers: {
                        Authorization:
                            `Bearer ${adminToken}`
                    }
                }
            );


        const data =
            await response.json();


        console.log(
            "Admin Profile API Response:",
            data
        );


        if (!response.ok) {

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                localStorage.removeItem(
                    "adminToken"
                );

                window.location.href =
                    "admin-login.html";

                return;

            }

            throw new Error(
                data.message ||
                "Failed to load profile."
            );

        }


        const user =
            data.user ||
            data.profile ||
            data;


        if (!user) {

            throw new Error(
                "Admin profile data not found."
            );

        }


        profileName.value =
            user.name || "";

        profileEmail.value =
            user.email || "";

        profilePhone.value =
            user.phone || "";

        profileAddress.value =
            user.address || "";

        profileRole.value =
            user.role === "admin"
                ? "Administrator"
                : user.role || "Administrator";

        profileJoined.value =
            formatDate(
                user.createdAt
            );


        const displayName =
            user.name || "Admin";


        profileDisplayName.textContent =
            displayName;

        topAdminName.textContent =
            displayName;


        profileForm.dataset.originalName =
            user.name || "";

        profileForm.dataset.originalPhone =
            user.phone || "";

        profileForm.dataset.originalAddress =
            user.address || "";


    } catch (error) {

        console.error(
            "Load profile error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to load admin profile.",
            "error"
        );

    }

}


/* =========================
   UPDATE PROFILE
========================= */

async function updateProfile(event) {

    event.preventDefault();

    clearMessage();


    const name =
        profileName.value.trim();

    const phone =
        profilePhone.value.trim();

    const address =
        profileAddress.value.trim();


    if (!name) {

        showMessage(
            "Please enter your name.",
            "error"
        );

        profileName.focus();

        return;

    }


    saveProfileBtn.disabled =
        true;

    saveProfileBtn.textContent =
        "Saving...";


    try {

        const response =
            await fetch(
                `${API_URL}/users/profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${adminToken}`
                    },

                    body: JSON.stringify({
                        name,
                        phone,
                        address
                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "Update Profile API Response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to update profile."
            );

        }


        profileDisplayName.textContent =
            name;

        topAdminName.textContent =
            name;


        profileForm.dataset.originalName =
            name;

        profileForm.dataset.originalPhone =
            phone;

        profileForm.dataset.originalAddress =
            address;


        showMessage(
            data.message ||
            "Profile updated successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Update profile error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to update profile.",
            "error"
        );

    } finally {

        saveProfileBtn.disabled =
            false;

        saveProfileBtn.textContent =
            "Save Changes";

    }

}


/* =========================
   CANCEL PROFILE
========================= */

function cancelChanges() {

    profileName.value =
        profileForm.dataset.originalName ||
        "";

    profilePhone.value =
        profileForm.dataset.originalPhone ||
        "";

    profileAddress.value =
        profileForm.dataset.originalAddress ||
        "";

    clearMessage();

}


/* =========================
   CHANGE PASSWORD
========================= */

async function changePassword(event) {

    event.preventDefault();

    clearMessage();


    const current =
        currentPassword.value;

    const newPass =
        newPassword.value;

    const confirm =
        confirmPassword.value;


    /* VALIDATION */

    if (!current || !newPass || !confirm) {

        showMessage(
            "Please fill in all password fields.",
            "error"
        );

        return;

    }


    if (newPass.length < 6) {

        showMessage(
            "New password must be at least 6 characters long.",
            "error"
        );

        return;

    }


    if (newPass !== confirm) {

        showMessage(
            "New password and confirm password do not match.",
            "error"
        );

        confirmPassword.focus();

        return;

    }


    if (current === newPass) {

        showMessage(
            "New password must be different from the current password.",
            "error"
        );

        return;

    }


    changePasswordBtn.disabled =
        true;

    changePasswordBtn.textContent =
        "Changing...";


    try {

        const response =
            await fetch(
                `${API_URL}/users/change-password`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${adminToken}`
                    },

                    body: JSON.stringify({
                        currentPassword: current,
                        newPassword: newPass
                    })
                }
            );


        const data =
            await response.json();


        console.log(
            "Change Password API Response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to change password."
            );

        }


        /* CLEAR FORM */

        passwordForm.reset();


        showMessage(
            data.message ||
            "Password changed successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Change password error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to change password.",
            "error"
        );

    } finally {

        changePasswordBtn.disabled =
            false;

        changePasswordBtn.textContent =
            "Change Password";

    }

}


/* =========================
   CLEAR PASSWORD
========================= */

function clearPasswordForm() {

    passwordForm.reset();

    clearMessage();

}


/* =========================
   SHOW / HIDE PASSWORD
========================= */

const showPasswordButtons =
    document.querySelectorAll(
        ".show-password-btn"
    );


showPasswordButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    this.dataset.target;

                const input =
                    document.getElementById(
                        targetId
                    );


                if (
                    input.type ===
                    "password"
                ) {

                    input.type =
                        "text";

                    this.textContent =
                        "🙈";

                } else {

                    input.type =
                        "password";

                    this.textContent =
                        "👁️";

                }

            }
        );

    }
);


/* =========================
   MOBILE MENU
========================= */

if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


/* =========================
   LOGOUT
========================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            localStorage.removeItem(
                "adminToken"
            );

            window.location.href =
                "admin-login.html";

        }
    );

}


/* =========================
   EVENTS
========================= */

if (profileForm) {

    profileForm.addEventListener(
        "submit",
        updateProfile
    );

}


if (cancelProfileBtn) {

    cancelProfileBtn.addEventListener(
        "click",
        cancelChanges
    );

}


if (passwordForm) {

    passwordForm.addEventListener(
        "submit",
        changePassword
    );

}


if (cancelPasswordBtn) {

    cancelPasswordBtn.addEventListener(
        "click",
        clearPasswordForm
    );

}


/* =========================
   LOAD
========================= */

loadProfile();