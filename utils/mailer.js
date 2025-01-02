const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'noreply.lyxux@gmail.com',
        pass: 'nkkj eyug rctm yhni',
    },
});

const sendOtpEmail = (otp, recipientEmail) => {
    const mailOptions = {
        from: 'noreply.lyxux@gmail.com',
        to: recipientEmail,
        subject: 'Your OTP for forget password',
        text: `Your OTP : ${otp}`,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;