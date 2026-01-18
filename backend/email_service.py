import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from jinja2 import Template
import logging

logger = logging.getLogger(__name__)

# Email configuration from environment variables
SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')  # Change to your webmail SMTP
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SMTP_USERNAME = os.getenv('SMTP_USERNAME', 'noreply@monacaptradingpro.com')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', '')  # Set your webmail password
SMTP_FROM_EMAIL = os.getenv('SMTP_FROM_EMAIL', 'noreply@monacaptradingpro.com')
SMTP_FROM_NAME = os.getenv('SMTP_FROM_NAME', 'Monacap Trading Pro')
APP_URL = os.getenv('APP_URL', 'http://localhost:3000')  # Frontend URL for email links

# Welcome email template
WELCOME_EMAIL_TEMPLATE = """
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
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">Welcome to Monacap Trading Pro</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #22d3ee; margin-top: 0; font-size: 24px;">Hello {{ user_name }},</h2>
                            
                            <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6;">
                                Thank you for joining <strong>Monacap Trading Pro</strong>, your trusted partner in copy trading success!
                            </p>
                            
                            <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6;">
                                Your account has been successfully created and you're now part of our exclusive trading community. Here's what you can do:
                            </p>
                            
                            <!-- Features -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td style="padding: 15px; background-color: #0a1628; border-radius: 5px; margin-bottom: 10px;">
                                        <p style="color: #22d3ee; margin: 0; font-weight: bold; font-size: 16px;">✓ Copy Expert Traders</p>
                                        <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">Follow and automatically copy trades from our top-performing traders</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px; background-color: #0a1628; border-radius: 5px;">
                                        <p style="color: #22d3ee; margin: 0; font-weight: bold; font-size: 16px;">✓ Real-Time Market Data</p>
                                        <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">Access live trading charts and market analysis</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px; background-color: #0a1628; border-radius: 5px;">
                                        <p style="color: #22d3ee; margin: 0; font-weight: bold; font-size: 16px;">✓ Secure Platform</p>
                                        <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">Trade with confidence on our enterprise-grade secure infrastructure</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Account Details -->
                            <div style="background-color: #0a1628; padding: 20px; border-radius: 5px; border-left: 4px solid #22d3ee; margin: 30px 0;">
                                <p style="color: #e5e7eb; margin: 0; font-size: 14px;"><strong>Your Account Details:</strong></p>
                                <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 14px;">Email: {{ user_email }}</p>
                                <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">Account ID: {{ user_id }}</p>
                            </div>
                            
                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 30px 0;">
                                        <a href="{{ app_url }}/login" style="background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">Access Your Dashboard</a>
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
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0a1628; padding: 30px; text-align: center; border-top: 1px solid #374151;">
                            <p style="color: #6b7280; font-size: 12px; margin: 0;">
                                © 2025 Monacap Trading Pro. All rights reserved.
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
"""

async def send_email(to_email: str, subject: str, html_content: str):
    """Send email via SMTP"""
    try:
        message = MIMEMultipart('alternative')
        message['From'] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
        message['To'] = to_email
        message['Subject'] = subject
        
        html_part = MIMEText(html_content, 'html')
        message.attach(html_part)
        
        # If SMTP password is not set, log instead of sending
        if not SMTP_PASSWORD:
            logger.warning(f"SMTP not configured. Would send email to {to_email}: {subject}")
            logger.info(f"Email content preview: {html_content[:200]}...")
            return True
        
        async with aiosmtplib.SMTP(hostname=SMTP_HOST, port=SMTP_PORT) as smtp:
            await smtp.starttls()
            await smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
            await smtp.send_message(message)
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False

async def send_welcome_email(user_name: str, user_email: str, user_id: str):
    """Send welcome email to new user"""
    template = Template(WELCOME_EMAIL_TEMPLATE)
    html_content = template.render(
        user_name=user_name,
        user_email=user_email,
        user_id=user_id,
        app_url=APP_URL
    )
    
    subject = "Welcome to Monacap Trading Pro - Your Account is Ready!"
    return await send_email(user_email, subject, html_content)
