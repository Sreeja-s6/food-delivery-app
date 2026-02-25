const Brevo = require("@getbrevo/brevo");

let apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;

const sendEmail = async ({ to, subject, text }) => {
    let sendSmtpEmail = new Brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.textContent = text;
    sendSmtpEmail.sender = {
        name: "Food Delivery App",
        email: process.env.EMAIL
    };
    sendSmtpEmail.to = [{ email: to }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = { sendEmail };