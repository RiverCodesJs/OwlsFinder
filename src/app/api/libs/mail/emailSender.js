import nodemailer from 'nodemailer'
import ERROR from '~/error'

const emailSender = async ({ reciver, template }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      pool: true, 
      maxConnections: 5, 
      rateLimit: 10 
    })
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: reciver,
      subject: template.subject,
      html: template.emailContent,
    }
    return await transporter.sendMail(mailOptions)    
  } catch (error) {
    return ERROR.BAD_EMAIL()
  }
}

export default emailSender