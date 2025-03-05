import nodemailer from 'nodemailer';

// Refs: Email utility to send emails (e.g., verification or reset link)
// Props & Store: Uses environment variables for configuration
// States: None
// Handlers: sendEmail function to encapsulate the mail sending logic

export interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/* Handlers */
// sendEmail function sends an email based on provided options.
export const sendEmail = async (options: IEmailOptions): Promise<void> => {
  // Create a transporter using SMTP details from environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Configure mail options
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Sender email address
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};
