const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
    }
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP Error:", error);
    } else {
        console.log("SMTP Server ready to send emails!");
    }
});

module.exports = transporter;