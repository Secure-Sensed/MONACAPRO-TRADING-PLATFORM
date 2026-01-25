const nodemailer = require("nodemailer");

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || "587");
const SMTP_USERNAME = process.env.SMTP_USERNAME || "noreply@monacaptradingpro.shop";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || "noreply@monacaptradingpro.shop";
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || "Monacap Trading Pro";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

const buildWelcomeEmail = ({ userName, userEmail, userId }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Monacap Trading Pro</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a1628;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a1628;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a2942; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">Welcome to Monacap Trading Pro</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #22d3ee; margin-top: 0; font-size: 24px;">Hello ${userName},</h2>
              <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6;">
                Thank you for joining <strong>Monacap Trading Pro</strong>, your trusted partner in copy trading success!
              </p>
              <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6;">
                Your account has been successfully created and you're now part of our exclusive trading community. Here's what you can do:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="padding: 15px; background-color: #0a1628; border-radius: 5px; margin-bottom: 10px;">
                    <p style="color: #22d3ee; margin: 0; font-weight: bold; font-size: 16px;">&#10003; Copy Expert Traders</p>
                    <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">Follow and automatically copy trades from our top-performing traders</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #0a1628; border-radius: 5px;">
                    <p style="color: #22d3ee; margin: 0; font-weight: bold; font-size: 16px;">&#10003; Real-Time Market Data</p>
                    <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">Access live trading charts and market analysis</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #0a1628; border-radius: 5px;">
                    <p style="color: #22d3ee; margin: 0; font-weight: bold; font-size: 16px;">&#10003; Secure Platform</p>
                    <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">Trade with confidence on our enterprise-grade secure infrastructure</p>
                  </td>
                </tr>
              </table>
              <div style="background-color: #0a1628; padding: 20px; border-radius: 5px; border-left: 4px solid #22d3ee; margin: 30px 0;">
                <p style="color: #e5e7eb; margin: 0; font-size: 14px;"><strong>Your Account Details:</strong></p>
                <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 14px;">Email: ${userEmail}</p>
                <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">Account ID: ${userId}</p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 30px 0;">
                    <a href="${APP_URL}/login" style="background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">Access Your Dashboard</a>
                  </td>
                </tr>
              </table>
              <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
                If you have any questions or need assistance, our support team is here to help 24/7.
              </p>
              <p style="color: #e5e7eb; font-size: 16px; margin-top: 30px;">
                Best regards,<br>
                <strong style="color: #22d3ee;">The Monacap Trading Pro Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0a1628; padding: 30px; text-align: center; border-top: 1px solid #374151;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                (c) 2025 Monacap Trading Pro. All rights reserved.
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
                <strong>Risk Warning:</strong> Trading involves substantial risk. Only invest what you can afford to lose.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const sendEmail = async ({ to, subject, html }) => {
  if (!SMTP_PASSWORD) {
    console.warn(`SMTP not configured. Would send email to ${to}: ${subject}`);
    return true;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
  });

  return true;
};

const sendWelcomeEmail = async ({ userName, userEmail, userId }) => {
  const html = buildWelcomeEmail({ userName, userEmail, userId });
  return sendEmail({
    to: userEmail,
    subject: "Welcome to Monacap Trading Pro - Your Account is Ready!",
    html,
  });
};

module.exports = {
  sendWelcomeEmail,
};
