const express = require("express");

const router = express.Router();

const {
    createContactMessage
} = require("../controllers/contactsController");


// ======================================
// CONTACT MESSAGE ROUTE
// ======================================

router.post("/", createContactMessage);


module.exports = router;