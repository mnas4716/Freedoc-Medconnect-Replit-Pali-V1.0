import nodemailer from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Use environment variables for email configuration
    const emailConfig: EmailConfig = {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER || "",
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || "",
      },
    };

    this.transporter = nodemailer.createTransport(emailConfig);
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: {
        name: "FreeDoc Australia",
        address: process.env.SMTP_USER || process.env.EMAIL_USER || "noreply@freedoc.com.au",
      },
      to: email,
      subject: "FreeDoc Email Verification - Your OTP Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>FreeDoc Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0d6efd; color: white; text-align: center; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .otp-box { background-color: white; border: 2px solid #0d6efd; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #0d6efd; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #6c757d; font-size: 14px; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🩺 FreeDoc Australia</h1>
              <p>Australia's First Truly Free Online Doctor</p>
            </div>
            <div class="content">
              <h2>Email Verification Required</h2>
              <p>Thank you for signing up with FreeDoc! To complete your registration and access free healthcare services, please verify your email address using the code below:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <p><strong>Your verification code</strong></p>
              </div>
              
              <p>Enter this 6-digit code in the verification form to activate your account. This code will expire in 10 minutes for security reasons.</p>
              
              <div class="warning">
                <strong>Security Notice:</strong> Never share this code with anyone. FreeDoc staff will never ask for your verification code via phone or email.
              </div>
              
              <p>Once verified, you'll have access to:</p>
              <ul>
                <li>✅ Free online prescriptions</li>
                <li>✅ Medical certificates</li>
                <li>✅ Mental health support</li>
                <li>✅ Telehealth consultations</li>
                <li>✅ Pathology referrals</li>
              </ul>
              
              <p>If you didn't create a FreeDoc account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 FreeDoc Australia. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        FreeDoc Australia - Email Verification
        
        Your verification code is: ${otp}
        
        Enter this code to complete your registration and access free healthcare services.
        This code expires in 10 minutes.
        
        If you didn't create a FreeDoc account, please ignore this email.
        
        © 2025 FreeDoc Australia
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`OTP email sent successfully to ${email}`);
    } catch (error) {
      console.error("Failed to send OTP email:", error);
      throw new Error("Failed to send verification email");
    }
  }

  async sendConsultationUpdate(
    email: string,
    patientName: string,
    consultationType: string,
    status: string,
    doctorName?: string
  ): Promise<void> {
    const statusMessages = {
      assigned: `Your ${consultationType} consultation has been assigned to ${doctorName}.`,
      in_progress: `${doctorName} is now reviewing your ${consultationType} consultation.`,
      completed: `Your ${consultationType} consultation has been completed. You can now download your documents from your dashboard.`,
    };

    const message = statusMessages[status as keyof typeof statusMessages] || `Your consultation status has been updated to ${status}.`;

    const mailOptions = {
      from: {
        name: "FreeDoc Australia",
        address: process.env.SMTP_USER || process.env.EMAIL_USER || "noreply@freedoc.com.au",
      },
      to: email,
      subject: `FreeDoc Consultation Update - ${consultationType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>FreeDoc Consultation Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0d6efd; color: white; text-align: center; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .status-box { background-color: white; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; color: #6c757d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🩺 FreeDoc Australia</h1>
              <p>Consultation Update</p>
            </div>
            <div class="content">
              <h2>Hello ${patientName},</h2>
              
              <div class="status-box">
                <h3>Consultation Update</h3>
                <p>${message}</p>
              </div>
              
              <p>You can view the full details and any available documents by logging into your FreeDoc dashboard.</p>
              
              <p>Thank you for choosing FreeDoc for your healthcare needs.</p>
            </div>
            <div class="footer">
              <p>© 2025 FreeDoc Australia. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Consultation update email sent to ${email}`);
    } catch (error) {
      console.error("Failed to send consultation update email:", error);
    }
  }
}

export const emailService = new EmailService();
