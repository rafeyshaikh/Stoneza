import nodemailer from "nodemailer";

export async function sendMail({ subject, receiver, body }) {
  const smtpPort = Number(process.env.SMTP_PORT || 587);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: receiver,
    subject: subject,
    html: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}