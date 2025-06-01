import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, code) => {
  try {
    const info = await transporter.sendMail({
      from: `Umbra TMS <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Doğrulama Kodu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Hoş Geldiniz!</h1>
          <p>Email adresinizi doğrulamak için aşağıdaki kodu kullanın:</p>
          <div style="background-color: #f5f5f5; 
                      padding: 20px; 
                      border-radius: 8px; 
                      text-align: center; 
                      margin: 20px 0;">
            <h2 style="color: #4CAF50; 
                      font-size: 32px; 
                      letter-spacing: 5px; 
                      margin: 0;">
              ${code}
            </h2>
          </div>
          <p style="color: #666; font-size: 14px;">Bu kod 10 dakika geçerlidir.</p>
          <p style="color: #666; font-size: 14px;">Eğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        </div>
      `,
    });
    console.log('Email başarıyla gönderildi:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email gönderme hatası:', error);
    return false;
  }
};

const sendTaskNotification = async (email, taskTitle, action) => {
  try {
    const info = await transporter.sendMail({
      from: `Umbra TMS <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Görev ${action}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Görev Bildirimi</h1>
          <p>"${taskTitle}" görevi ${action}.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Email gönderme hatası:', error);
    return false;
  }
};

export {
  sendVerificationEmail,
  sendTaskNotification
}; 