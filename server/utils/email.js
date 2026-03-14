const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Note: For a production app, you would configure a real SMTP provider here (SendGrid, Mailgun, etc.)
    // For demo purposes, we can use Ethereal or configure basic Gmail SMTP.
    
    // We will use a standard configuration relying on process.env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `M-Art Marketplace <${process.env.FROM_EMAIL || 'noreply@m-art.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    
    // If using Ethereal, you can log the preview URL:
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    // Do not throw error to avoid breaking the payment flow if email fails
    return false;
  }
};

module.exports = sendEmail;
