import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMagicLink = async (
  token: string,
  email: string
): Promise<boolean> => {
  try {
    const magicLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verify?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Magic Link for Sign In",
      html: `
      <h1>Sign In to Your Account</h1>
      <p>Click the link below to sign in:</p>
      <a href="${magicLink}">Sign In</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn't request this link, please ignore this email.</p>
    `,
    };
    const info = await transporter.sendMail(mailOptions);
    if (info.messageId) {
      return true;
      console.log("Email is successfully sent", info.messageId);
    } else {
      return false;
    }
  } catch (err) {
    return false;
    console.log(err);
  }
};
