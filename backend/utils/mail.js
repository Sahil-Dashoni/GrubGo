import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  connectionTimeout: 10000, // 10 sec
});

export const sendOtpMail = async (to, otp) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject: "Reset Your Password",
            html:`<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
        });

        console.log("MAIL SENT:", info.response);

    } catch (error) {
        console.log("MAIL ERROR:", error); // 🔥 THIS WILL SHOW REAL ERROR
        throw error;
    }
};


export const sendDeliveryOtpMail=async (user,otp) => {
    await transporter.sendMail({
        from:process.env.EMAIL,
        to:user.email,
        subject:"Delivery OTP",
        html:`<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`
    })
}
