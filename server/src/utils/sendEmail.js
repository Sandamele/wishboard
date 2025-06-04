import nodemailer from "nodemailer";
export const sendEmail = async (recipient, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.NODEMAILER_SERVICE || "gmail",
      secure: false,
      host: process.env.NODEMAILER_HOST || "smtp.gmail.com",
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: recipient,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    return { error: null, send: true };
  } catch (error) {
    return { error, send: false };
  }
};
