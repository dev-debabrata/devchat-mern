import { transporter, sender } from "../lib/nodemailer.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  try {
    const info = await transporter.sendMail({
      from: `${sender.name} <${sender.email}>`,
      to: email,
      subject: "Welcome to DevChat!",
      html: createWelcomeEmailTemplate(name, clientURL),
    });

    console.log("Welcome email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending welcome email:", error.message);
    throw new Error("Failed to send welcome email");
  }
};

