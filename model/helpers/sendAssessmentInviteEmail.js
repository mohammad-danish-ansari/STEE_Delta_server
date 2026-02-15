import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const sendAssessmentInviteEmail = async (data) => {
  try {
    
    const assessmentLink = `https://assessment-portal-cv6r.onrender.com/`; 

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Assessment Team",
          email: process.env.FROM_EMAIL,
        },
        to: [{ email: data.email }],
        subject: "Assessment Invitation – Complete Within 2 Days",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding:20px;">
            <h2>Hello ${data.name},</h2>
            
            <p>You have been shortlisted for the next round of our selection process.</p>
            
            <p>Please complete your assessment by clicking the link below:</p>
            
            <div style="margin:20px 0;">
              <a href="${assessmentLink}" 
                 style="background-color:#000; color:#fff; padding:12px 20px; text-decoration:none; border-radius:5px;">
                 Start Assessment
              </a>
            </div>

            <p><strong>Important:</strong> You must complete this assessment within 
            <span style="color:red;">2 days</span>. 
            After that, your application may not be considered.</p>

            <p>Best Regards,<br/>HR Team</p>
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

    console.log("Assessment email eent=====", response.data);
  } catch (error) {
    console.log(
      "BREVO ERROR:",
      error.response?.data || error.message
    );
  }
};
