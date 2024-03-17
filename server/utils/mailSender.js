import nodemailer from "nodemailer"

export const mailSender = async (sendTo, subject, body) => {
    try {


        const transporter = nodemailer.createTransport(
            {
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            }
        );

        const options = {
            from: `${process.env.MAIL_USER}`,
            to: `${sendTo}`,
            subject: `${subject}`,
            html: `${body}`,
        }

        const res = await transporter.sendMail(options);

        return res;

    } catch (error) {
        console.log("Email sending error: ");
        console.log(error.message);
        throw new Error("Email sending error");
    }
}