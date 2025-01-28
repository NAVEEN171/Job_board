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
      subject:
        "Welcome to Flexiboard! continue your journey after verification",
      html: `
     
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #fff;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          font-size: 24px;
          color: #2c3e50;
          margin-bottom: 10px;
        }
        p {
          font-size: 16px;
          color: #333;
        }
        .magiclink {
          display: inline-block;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          font-weight: bold;
          margin-top: 10px;
        }
        
        .or-element{
           margin-left:20px;
        }
           .verify{
                background-color: #4aa3fa;
                color:white !important;
                border:none;
              outline:none;
              padding:10px 20px;
              font-size:16px !important;
              font-weight:500 !important;
              text-decoration:none !important;
               appearance: none; 
             -webkit-appearance: none; 


           }
             
      </style>
    </head>
    <body>
      <div class="email-container">
        <h1>Sign In to Your Account</h1>
        <p>Click the link below to sign :</p>
         <p>This link will expire in 15 minutes.</p>
        <a class="magiclink" href="${magicLink}">${magicLink}</a>
        <p class="or-element">or</p>
        <a class="verify" href="${magicLink}">Verify your account</a>
        <p>If you didn't request this link, please ignore this email.</p>
      </div>
    </body>
  </html>
    `,
    };
    const info = await transporter.sendMail(mailOptions);
    if (info.messageId) {
      console.log("Email is successfully sent", info.messageId);

      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);

    return false;
  }
};
