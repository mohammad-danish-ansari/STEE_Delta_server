import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const emailotp = async (data) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "OTP Service",
          email: process.env.FROM_EMAIL,
        },
        to: [{ email: data.user }],
        subject: "Your OTP Code",
        htmlContent: `
          <div style="font-family: Arial; padding:20px;">
            <h2>Email Verification</h2>
            <h1>${data.otp}</h1>
            <p>This OTP expires in 2 minutes.</p>
          </div>
        `,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );

    console.log("OTP Sent:", response.data);
  } catch (error) {
    console.log(
      "FULL BREVO ERROR:",
      error.response?.data || error.message
    );
  }
};
