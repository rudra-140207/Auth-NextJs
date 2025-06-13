import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    const route = emailType === "VERIFY" ? "verifyemail" : "resetpassword";

    const subject =
      emailType === "VERIFY" ? "Verify your email" : "Reset your password";
    const heading =
      emailType === "VERIFY"
        ? "Verify Your Email Address"
        : "Reset Your Password";
    const buttonText =
      emailType === "VERIFY" ? "Verify Email" : "Reset Password";
    const actionText =
      emailType === "VERIFY"
        ? "verify your email address"
        : "reset your password";

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en" >
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${subject}</title>
        <style>
          body, p, a {
            margin: 0; padding: 0; text-decoration: none; color: inherit;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
              Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #f7f9fc;
            color: #333333;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 30px;
          }
          h1 {
            font-size: 24px;
            color: #1a202c;
            margin-bottom: 20px;
          }
          p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 25px;
          }
          .button {
            display: inline-block;
            background-color: #2563eb;
            color: white !important;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background-color: #1e40af;
          }
          .footer {
            font-size: 14px;
            color: #777777;
            margin-top: 30px;
            text-align: center;
          }
          .link-text {
            word-break: break-all;
            color: #2563eb;
            font-size: 14px;
            line-height: 1.4;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${heading}</h1>
          <p>
            Please click the button below to ${actionText}.
          </p>
          <p style="text-align:center;">
            <a href="${process.env.DOMAIN}/${route}?token=${hashedToken}" class="button" target="_blank" rel="noopener noreferrer">
              ${buttonText}
            </a>
          </p>
          <p>
            If the button above does not work, copy and paste the following link into your web browser:
          </p>
          <p class="link-text">
            <a href="${process.env.DOMAIN}/${route}?token=${hashedToken}" target="_blank" rel="noopener noreferrer">
              ${process.env.DOMAIN}/${route}?token=${hashedToken}
            </a>
          </p>
          <p class="footer">
            If you did not request this, please ignore this email.
          </p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: htmlContent,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    console.log("Email sent:", mailResponse.messageId);
    return mailResponse;
  } catch (error: any) {
    console.error("Error sending email:", error.message);
    throw new Error(error.message);
  }
};
