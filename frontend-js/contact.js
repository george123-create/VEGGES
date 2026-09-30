// ======================================
// VEGGES - CONTACT PAGE
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.getElementById("contactForm");
    const contactSuccess = document.getElementById("contactSuccess");

    // Make sure the form exists
    if (!contactForm) {
        return;
    }

    contactForm.addEventListener("submit", function (event) {

        // Prevent page refresh
        event.preventDefault();

        // Get form values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        // Check required fields
        if (!name || !email || !subject || !message) {
            alert("Please fill in all the fields.");
            return;
        }

        // Show success message
        contactSuccess.style.display = "block";

        // Clear the form
        contactForm.reset();

        // Hide success message after 3 seconds
        setTimeout(function () {
            contactSuccess.style.display = "none";
        }, 3000);

    });

});