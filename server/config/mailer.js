const { BrevoClient } = require("@getbrevo/brevo");

const client = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});

const sendEmail = async ({ to, subject, text }) => {
    await client.transactionalEmails.send({
        subject: subject,
        textContent: text,
        sender: {
            name: "Food Delivery App",
            email: process.env.EMAIL
        },
        to: [{ email: to }]
    });
};

module.exports = { sendEmail };