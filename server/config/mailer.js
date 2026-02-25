const axios = require("axios");

const sendEmail = async ({ to, subject, text }) => {
    await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: {
                name: "Food Delivery App",
                email: process.env.EMAIL
            },
            to: [{ email: to }],
            subject: subject,
            textContent: text
        },
        {
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "Content-Type": "application/json"
            }
        }
    );
};

module.exports = { sendEmail };