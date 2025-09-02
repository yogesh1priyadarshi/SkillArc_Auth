// utils/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or "hotmail", "yahoo", or SMTP config
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password (not your real password!)
  },
});

async function sendEmail(to, subject, text, html) {
  const mailOptions = {
    from: `"MyApp" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
}
// Function to send OTP to email
async function sendOTP(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Account Verification",
    text: `Your OTP for email verification is ${otp}. It will expire in 5 minutes.`,
    html: `<p>Your OTP for email verification is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    // Check if email was accepted
    if (info.accepted.length > 0) {
      return {
        success: true,
        message: "OTP email sent successfully",
        messageId: info.messageId, // useful for debugging/logging
      };
    } else {
      return {
        success: false,
        message: "Email not accepted by server",
      };
    }

  } catch (error) {
    logger.error(JSON.stringify({ error }));
    console.error("Error sending OTP email:", error);
    return {
      success: false,
      message: "Failed to send OTP email",
      error: error.message,
    };
  }
}


module.exports = {sendOTP,sendEmail};
