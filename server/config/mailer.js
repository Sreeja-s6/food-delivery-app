const { Brevo } = require("@getbrevo/brevo");

const sendEmail = async ({ to, subject, text }) => {
    await Brevo.transactionalEmails.send({
        subject: subject,
        textContent: text,
        sender: {
            name: "Food Delivery App",
            email: process.env.EMAIL
        },
        to: [{ email: to }]
    }, {
        headers: {
            "api-key": process.env.BREVO_API_KEY
        }
    });
};

module.exports = { sendEmail };