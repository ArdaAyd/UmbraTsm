import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Singleton Pattern ile transporter
class EmailTransporter {
  constructor() {
    if (!EmailTransporter.instance) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      EmailTransporter.instance = this;
    }
    return EmailTransporter.instance;
  }

  getTransporter() {
    return this.transporter;
  }
}

const getEmailTransporter = () => {
  const instance = new EmailTransporter();
  return instance.getTransporter();
};

const sendVerificationEmail = async (email, code) => {
  const transporter = getEmailTransporter();
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
  const transporter = getEmailTransporter();
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

const sendTaskAssignmentEmail = async (email, assignedBy, taskTitle, taskDescription) => {
  const transporter = getEmailTransporter();
  try {
    const info = await transporter.sendMail({
      from: `Umbra TMS <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Bir Göreve Atandınız: ${taskTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Yeni Görev Ataması</h2>
          <p><b>${assignedBy}</b> tarafından bir göreve atandınız.</p>
          <p><b>Görev Başlığı:</b> ${taskTitle}</p>
          <p><b>Açıklama:</b> ${taskDescription || "-"}</p>
          <p style="color: #666; font-size: 14px;">Umbra TMS üzerinden detayları görebilirsiniz.</p>
        </div>
      `,
    });
    console.log('Task assignment email gönderildi:', info.messageId);
    return true;
  } catch (error) {
    console.error('Task assignment email gönderme hatası:', error);
    return false;
  }
};

const sendTaskStageChangeEmail = async (email, taskTitle, oldStage, newStage) => {
  const transporter = getEmailTransporter();
  try {
    const info = await transporter.sendMail({
      from: `Umbra TMS <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Görev Durumu Güncellendi: ${taskTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Görev Durumu Değişti</h2>
          <p><b>${taskTitle}</b> başlıklı görevin durumu <b>${oldStage}</b> → <b>${newStage}</b> olarak güncellendi.</p>
          <p style="color: #666; font-size: 14px;">Umbra TMS üzerinden detayları görebilirsiniz.</p>
        </div>
      `,
    });
    console.log('Task stage change email gönderildi:', info.messageId);
    return true;
  } catch (error) {
    console.error('Task stage change email gönderme hatası:', error);
    return false;
  }
};

// Factory Pattern: NotificationFactory
class NotificationFactory {
  static createNotification(type, params) {
    switch (type) {
      case 'verification':
        return sendVerificationEmail(params.email, params.code);
      case 'taskAssignment':
        return sendTaskAssignmentEmail(params.email, params.assignedBy, params.taskTitle, params.taskDescription);
      case 'taskStageChange':
        return sendTaskStageChangeEmail(params.email, params.taskTitle, params.oldStage, params.newStage);
      case 'taskNotification':
        return sendTaskNotification(params.email, params.taskTitle, params.action);
      default:
        throw new Error('Bilinmeyen bildirim tipi!');
    }
  }
}

export {
  sendVerificationEmail,
  sendTaskNotification,
  sendTaskAssignmentEmail,
  sendTaskStageChangeEmail,
  NotificationFactory
}; 