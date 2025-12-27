import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { ENV } from "./env.js";

dotenv.config();

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
    },
});

export const sender = {
    name: ENV.SENDER_NAME,
    email: ENV.SENDER_EMAIL,
};

// export const sender = `${ENV.SENDER_NAME} <${ENV.SENDER_EMAIL}>`;

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP connection error:", error);
    } else {
        console.log("SMTP server is ready to send emails");
    }
});
