import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";

const apiInstance = new TransactionalEmailsApi();

apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendOtpMail = async (to, otp) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: { email: process.env.EMAIL },
      to: [{ email: to }],
      subject: "Reset Password",
      htmlContent: `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
    });

    console.log("MAIL SENT ✅");

  } catch (error) {
    console.log("BREVO ERROR:", error);
    throw error;
  }
};

export const sendDeliveryOtpMail = async (user, otp) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: { email: process.env.EMAIL },
      to: [{ email: user.email }],
      subject: "Delivery OTP",
      htmlContent: `<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`
    });

    console.log("MAIL SENT ✅");

  } catch (error) {
    console.log("BREVO ERROR:", error);
    throw error;
  }
};