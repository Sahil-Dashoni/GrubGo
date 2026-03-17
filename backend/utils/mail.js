import SibApiV3Sdk from '@getbrevo/brevo';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;


export const sendOtpMail = async (to, otp) => {
    try {
        await apiInstance.sendTransacEmail({
            sender: { email: process.env.EMAIL },
            to: [{ email: to }],
            subject: "Reset Your Password",
            html:`<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
        });

        console.log("MAIL SENT:", info.response);

    } catch (error) {
        console.log("MAIL ERROR:", error); 
        throw error;
    }
};


export const sendDeliveryOtpMail=async (user,otp) => {
    try {
        await apiInstance.sendTransacEmail({
            sender: { email: process.env.EMAIL },
            to: [{ email: user.email }],
        subject:"Delivery OTP",
        html:`<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`
    });
    } catch (error) {
        console.log("MAIL ERROR:", error);
    }
};

