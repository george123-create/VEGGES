const Contact = require("../models/contacts");

// ======================================
// CREATE CONTACT MESSAGE
// ======================================

const createContactMessage = async (req, res) => {

    try {

        const {
            name,
            email,
            subject,
            message
        } = req.body;


        // Check required fields

        if (!name || !email || !subject || !message) {

            return res.status(400).json({
                success: false,
                message: "Please fill in all the fields."
            });

        }


        // Create contact message

        const contact = await Contact.create({

            name: name.trim(),

            email: email.trim(),

            subject: subject.trim(),

            message: message.trim()

        });


        // Success response

        res.status(201).json({

            success: true,

            message: "Your message has been sent successfully!",

            contact

        });

    } catch (error) {

        console.error(
            "Contact message error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Server error. Unable to send your message."

        });

    }

};


module.exports = {
    createContactMessage
};