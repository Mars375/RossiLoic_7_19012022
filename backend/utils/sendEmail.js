const nodemailer = require('nodemailer');

module.exports = async (email, text) => {
  try {
    const transporter = nodemailer.createTransport({ // configuracion de transporte
      host: process.env.HOST, // SMTP server
      port: 587,
      auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.PASSWORD
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: email, // An array if you have multiple recipients.
      subject: "Reset password", // Subject line
      html: `Click on the link to reset your password : <br/>
      <a href=${text}>here</a>
      <br/>
      <br/>
      If the link is not working, copy and paste the following link in your browser:
      <br/>
      <br/>
      <a href=${text}>${text}</a>
      <br/>
      <br/>
      The link is valid for 1 hour.
      <br/>
      If you didn't request a password reset, please ignore this email.`
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.log(error, 'Error sending email');
  }
} 