import axios from "axios";

export const sendOtpMail = async (to, otp) => {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: { email: process.env.EMAIL },
                to: [{ email: to }],
                subject: "Reset Password",
                htmlContent: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("MAIL SENT ✅", response.data);

    } catch (error) {
        console.log("BREVO ERROR:", error.response?.data || error.message);
        throw error;
    }
};

export const sendDeliveryOtpMail = async (user, otp) => {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: { email: process.env.EMAIL },
                to: [{ email: user.email }],
                subject: "Delivery OTP",
                htmlContent: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("MAIL SENT ✅", response.data);

    } catch (error) {
        console.log("BREVO ERROR:", error.response?.data || error.message);
        throw error;
    }
};