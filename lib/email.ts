import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Verify transporter connection (optional - call this to test connection)
export const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("Email transporter is ready");
    return { success: true };
  } catch (error) {
    console.error("Email transporter verification failed:", error);
    return { success: false, error };
  }
};
