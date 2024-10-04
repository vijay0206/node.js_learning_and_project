const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create a transporter

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // should be 'sandbox.smtp.mailtrap.io'
    port: 587, // try 587 for TLS, or 465 for SSL
    secure: false, // set to 'true' if you use port 465
    auth: {
      user: process.env.EMAIL_USERNAME, // your Mailtrap username
      pass: process.env.EMAIL_PASSWORD, // your Mailtrap password
    },
  });

  //define email options
  const mailOptions = {
    from: 'Vijay Kulkarni <vijay.kulkarni@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //send the email with nodemailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
