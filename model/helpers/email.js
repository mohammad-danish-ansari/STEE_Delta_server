import nodemailer from "nodemailer"

export const emailotp = async(data)=>{
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: data.user,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${data.otp}. It will expire in 10 minutes.`
        };
    
        await transporter.sendMail(mailOptions,(error,info) =>{
            if (error) {
                console.log(error);
                // res.status(500).send('Error Sending mail.')               
            } else {
                console.log(info.response);
                // res.send('Email Sent.')
            }
        });
    } catch (error) {
        console.error(error);
            // return res.status(500).json({ message: "Server error", error });
           
    }
}



export default emailotp