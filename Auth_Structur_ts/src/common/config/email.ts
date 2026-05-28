import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,    
  auth: {
    user: process.env.SMTP_USER,          // SMTP username
    pass: process.env.SMTP_PASS,          // SMTP password
  },

});

const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};

 const sendVerificationEmail = async (email: string, token: string) => {
  const url = `${process.env.CLIENT_URL}/auth/verify-email/${token}`;
  await sendEmail(
    email,
    "Verify your email",
    `<h2>Welcome!</h2><p>Click <a href="${url}">here</a> to verify your email.</p>`,
  );
};

const sendResetPasswordEmail = async (email:string,token:string) => {
  const url =`${process.env.CLIENT_URL}/auth/reset-password/${token}`;
    await sendEmail(
    email,
    "Reset Password",
    `<h2>Welcome!</h2><p>Click <a href="${url}">here</a> to Reset your password.</p>`,
  );
}

export{sendVerificationEmail,sendResetPasswordEmail}