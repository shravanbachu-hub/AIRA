// import nodemailer from 'nodemailer';

// let transporter = null;

// export function initMailer() {
//   if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
//     console.warn('⚠ Gmail credentials not set — emails will be skipped');
//     return;
//   }
//   transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
//   });
//   console.log('✓ Email service ready');
// }

// export async function sendNewRegistrationEmail(data) {
//   if (!transporter) return;
//   try {
//     await transporter.sendMail({
//       from: `"AiraPropFirm" <${process.env.GMAIL_USER}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: `[AiraPropFirm] New Registration: ${data.name} (${data.email})`,
//       html: `
//         <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A0B0D;color:#F0F0F0;padding:32px;border-radius:12px;">
//           <div style="text-align:center;margin-bottom:24px;">
//             <div style="display:inline-block;background:#C9A84C;color:#0A0B0D;font-size:24px;font-weight:bold;width:44px;height:44px;line-height:44px;border-radius:10px;">A</div>
//             <h2 style="color:#F0F0F0;margin-top:12px;">New Trader Registration</h2>
//           </div>
//           <div style="background:#12141A;border:1px solid #1A1D26;border-radius:10px;padding:24px;margin-bottom:20px;">
//             <p><strong style="color:#C9A84C;">Name:</strong> ${data.name}</p>
//             <p><strong style="color:#C9A84C;">Email:</strong> ${data.email}</p>
//             <p><strong style="color:#C9A84C;">Phone:</strong> ${data.phone || 'Not provided'}</p>
//             <p><strong style="color:#C9A84C;">Time:</strong> ${new Date().toLocaleString()}</p>
//           </div>
//           <p style="color:#8A8F9E;">Log in to your AiraPropFirm admin panel to <strong style="color:#2ECC71;">APPROVE</strong> or <strong style="color:#E74C3C;">REJECT</strong> this registration.</p>
//           <p style="margin-top:16px;"><a href="${process.env.SITE_URL}" style="color:#C9A84C;">Open Admin Panel →</a></p>
//         </div>`,
//     });
//   } catch (e) { console.error('Email send failed:', e.message); }
// }

// export async function sendApprovalEmail(data) {
//   if (!transporter) return;
//   try {
//     await transporter.sendMail({
//       from: `"AiraPropFirm" <${process.env.GMAIL_USER}>`,
//       to: data.email,
//       subject: `[AiraPropFirm] Account Approved — You're In!`,
//       html: `
//         <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A0B0D;color:#F0F0F0;padding:32px;border-radius:12px;">
//           <div style="text-align:center;margin-bottom:24px;">
//             <div style="display:inline-block;background:#C9A84C;color:#0A0B0D;font-size:24px;font-weight:bold;width:44px;height:44px;line-height:44px;border-radius:10px;">A</div>
//             <h2 style="color:#2ECC71;margin-top:12px;">✓ Account Approved!</h2>
//           </div>
//           <p>Hi ${data.name},</p>
//           <p>Your <strong style="color:#C9A84C;">AiraPropFirm</strong> trader account has been approved.</p>
//           <div style="background:#12141A;border:1px solid #C9A84C33;border-radius:10px;padding:24px;margin:20px 0;text-align:center;">
//             <p style="color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Account Size</p>
//             <p style="font-size:36px;font-weight:bold;color:#F0F0F0;">$200,000</p>
//           </div>
//           <p>Log in at <a href="${process.env.SITE_URL}" style="color:#C9A84C;">${process.env.SITE_URL}</a> with your email and password.</p>
//           <p style="color:#8A8F9E;font-size:13px;margin-top:24px;">Welcome aboard!<br/>AiraPropFirm Team</p>
//         </div>`,
//     });
//   } catch (e) { console.error('Email send failed:', e.message); }
// }

// export async function sendRejectionEmail(data) {
//   if (!transporter) return;
//   try {
//     await transporter.sendMail({
//       from: `"AiraPropFirm" <${process.env.GMAIL_USER}>`,
//       to: data.email,
//       subject: `[AiraPropFirm] Registration Update`,
//       html: `
//         <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A0B0D;color:#F0F0F0;padding:32px;border-radius:12px;">
//           <h2>Registration Update</h2>
//           <p>Hi ${data.name},</p>
//           <p>We regret to inform you that your AiraPropFirm registration has not been approved at this time.</p>
//           <p>Contact <a href="mailto:support@airapropfirm.com" style="color:#C9A84C;">support@airapropfirm.com</a> if you believe this is an error.</p>
//           <p style="color:#8A8F9E;margin-top:24px;">AiraPropFirm Team</p>
//         </div>`,
//     });
//   } catch (e) { console.error('Email send failed:', e.message); }
// }

// export async function sendPasswordResetEmail(email, tempPassword) {
//   if (!transporter) return;
//   try {
//     await transporter.sendMail({
//       from: `"AiraPropFirm" <${process.env.GMAIL_USER}>`,
//       to: email,
//       subject: `[AiraPropFirm] Password Reset`,
//       html: `
//         <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A0B0D;color:#F0F0F0;padding:32px;border-radius:12px;">
//           <h2>Password Reset</h2>
//           <p>Your AiraPropFirm password has been reset.</p>
//           <div style="background:#12141A;border:1px solid #C9A84C33;border-radius:10px;padding:24px;margin:20px 0;text-align:center;">
//             <p style="color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:2px;">New Temporary Password</p>
//             <p style="font-size:28px;font-weight:bold;color:#F0F0F0;font-family:monospace;">${tempPassword}</p>
//           </div>
//           <p>Log in at <a href="${process.env.SITE_URL}" style="color:#C9A84C;">${process.env.SITE_URL}</a> and change your password.</p>
//           <p style="color:#8A8F9E;margin-top:24px;">AiraPropFirm Team</p>
//         </div>`,
//     });
//   } catch (e) { console.error('Email send failed:', e.message); }
// }

// export async function sendChallengeEmail(data) {
//   if (!transporter) {
//     console.log('📧 Challenge application (email skipped - no credentials):');
//     console.log(`   Name: ${data.firstName} ${data.lastName}`);
//     console.log(`   Email: ${data.email}`);
//     console.log(`   Platform: ${data.platform}`);
//     console.log(`   Experience: ${data.experience}`);
//     console.log(`   Payment: ${data.paymentMethod}`);
//     return;
//   }
//   try {
//     await transporter.sendMail({
//       from: `"AiraPropFirm" <${process.env.GMAIL_USER}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: `[AiraPropFirm] New Challenge Application: ${data.firstName} ${data.lastName}`,
//       html: `
//         <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A0B0D;color:#F0F0F0;padding:32px;border-radius:12px;">
//           <div style="text-align:center;margin-bottom:24px;">
//             <div style="display:inline-block;background:#C9A84C;color:#0A0B0D;font-size:24px;font-weight:bold;width:44px;height:44px;line-height:44px;border-radius:10px;">A</div>
//             <h2 style="color:#F0F0F0;margin-top:12px;">🏆 New Challenge Application</h2>
//           </div>
//           <div style="background:#12141A;border:1px solid #1A1D26;border-radius:10px;padding:24px;margin-bottom:20px;">
//             <h3 style="color:#C9A84C;margin-bottom:16px;font-size:16px;text-transform:uppercase;letter-spacing:1px;">Applicant Details</h3>
//             <table style="width:100%;border-collapse:collapse;">
//               <tr><td style="color:#8A8F9E;padding:8px 0;border-bottom:1px solid #1A1D26;">First Name</td><td style="color:#F0F0F0;padding:8px 0;border-bottom:1px solid #1A1D26;text-align:right;font-weight:600;">${data.firstName}</td></tr>
//               <tr><td style="color:#8A8F9E;padding:8px 0;border-bottom:1px solid #1A1D26;">Last Name</td><td style="color:#F0F0F0;padding:8px 0;border-bottom:1px solid #1A1D26;text-align:right;font-weight:600;">${data.lastName}</td></tr>
//               <tr><td style="color:#8A8F9E;padding:8px 0;border-bottom:1px solid #1A1D26;">Email</td><td style="color:#F0F0F0;padding:8px 0;border-bottom:1px solid #1A1D26;text-align:right;font-weight:600;">${data.email}</td></tr>
//               <tr><td style="color:#8A8F9E;padding:8px 0;border-bottom:1px solid #1A1D26;">Address</td><td style="color:#F0F0F0;padding:8px 0;border-bottom:1px solid #1A1D26;text-align:right;font-weight:600;">${data.address}</td></tr>
//               <tr><td style="color:#8A8F9E;padding:8px 0;border-bottom:1px solid #1A1D26;">Experience</td><td style="color:#F0F0F0;padding:8px 0;border-bottom:1px solid #1A1D26;text-align:right;font-weight:600;">${data.experience}</td></tr>
//               <tr><td style="color:#8A8F9E;padding:8px 0;border-bottom:1px solid #1A1D26;">Platform</td><td style="color:#C9A84C;padding:8px 0;border-bottom:1px solid #1A1D26;text-align:right;font-weight:600;">${data.platform}</td></tr>
//               <tr><td style="color:#8A8F9E;padding:8px 0;">Payment Method</td><td style="color:#2ECC71;padding:8px 0;text-align:right;font-weight:600;">${data.paymentMethod}</td></tr>
//             </table>
//           </div>
//           <div style="background:#C9A84C15;border:1px solid #C9A84C40;border-radius:10px;padding:20px;margin-bottom:20px;">
//             <h4 style="color:#C9A84C;margin-bottom:8px;">💰 Payment Expected</h4>
//             <p style="color:#F0F0F0;margin:4px 0;">Challenge Fee: <strong>$1,050</strong></p>
//             <p style="color:#F0F0F0;margin:4px 0;">Security Deposit: <strong>9,500 USDT</strong></p>
//             <p style="color:#F0F0F0;margin:4px 0;">Method: <strong>${data.paymentMethod}</strong></p>
//           </div>
//           <p style="color:#8A8F9E;font-size:13px;">Submitted at ${new Date().toLocaleString()}</p>
//           <p style="margin-top:16px;"><a href="${process.env.SITE_URL}" style="color:#C9A84C;">Open Admin Panel →</a></p>
//         </div>`,
//     });
//   } catch (e) { console.error('Challenge email send failed:', e.message); }
// }



import { Resend } from 'resend';

let resend = null;
let SENDER = '';

export function initMailer() {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠ RESEND_API_KEY not set — emails will be skipped');
    return;
  }
  resend = new Resend(process.env.RESEND_API_KEY);
  SENDER = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
  console.log('✓ Resend email service ready');
}

async function send({ to, subject, html }) {
  if (!resend) return;
  try {
    const { error } = await resend.emails.send({ from: `AiraPropFirm <${SENDER}>`, to, subject, html });
    if (error) console.error('Email send failed:', error.message);
  } catch (e) {
    console.error('Email send failed:', e.message);
  }
}

export async function sendNewRegistrationEmail(data) {
  await send({ to: process.env.ADMIN_EMAIL, subject: `[AiraPropFirm] New Registration: ${data.name} (${data.email})`, html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A0B0D;color:#F0F0F0;padding:32px;border-radius:12px;"><div style="text-align:center;margin-bottom:24px;"><div style="display:inline-block;background:#C9A84C;color:#0A0B0D;font-size:24px;font-weight:bold;width:44px;height:44px;line-height:44px;border-radius:10px;">A</div><h2 style="color:#F0F0F0;margin-top:12px;">New Trader Registration</h2></div><div style="background:#12141A;border:1px solid #1A1D26;border-radius:10px;padding:24px;margin-bottom:20px;"><p><strong style="color:#C9A84C;">Name:</strong> ${data.name}</p><p><strong style="color:#C9A84C;">Email:</strong> ${data.email}</p><p><strong style="color:#C9A84C;">Phone:</strong> ${data.phone || 'Not provided'}</p><p><strong style="color:#C9A84C;">Time:</strong> ${new Date().toLocaleString()}</p></div><p style="color:#8A8F9E;">Log in to approve or reject.</p><p style="margin-top:16px;"><a href="${process.env.SITE_URL}" style="color:#C9A84C;">Open Admin Panel →</a></p></div>` });
}

export async function sendApprovalEmail(data) {
  await send({ to: data.email, subject: `[AiraPropFirm] Account Approved — You're In!`, html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A0B0D;color:#F0F0F0;padding:32px;border-radius:12px;"><div style="text-align:center;margin-bottom:24px;"><div style="display:inline-block;background:#C9A84C;color:#0A0B0D;font-size:24px;font-weight:bold;width:44px;height:44px;line-height:44px;border-radius:10px;">A</div><h2 style="color:#2ECC71;margin-top:12px;">✓ Account Approved!</h2></div><p>Hi ${data.name},</p><p>Your <strong style="color:#C9A84C;">AiraPropFirm</strong> trader account has been approved.</p><div style="background:#12141A;border:1px solid #C9A84C33;border-radius:10px;padding:24px;margin:20px 0;text-align:center;"><p style="color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Account Size</p><p style="font-size:36px;font-weight:bold;color:#F0F0F0;">$200,000</p></div><p>Log in at <a href="${process.env.SITE_URL}" style="color:#C9A84C;">${process.env.SITE_URL}</a></p><p style="color:#8A8F9E;font-size:13px;margin-top:24px;">Welcome aboard!<br/>AiraPropFirm Team</p></div>` });
}

export async function sendRejectionEmail(data) {
  await send({ to: data.email, subject: `[AiraPropFirm] Registration Update`, html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A0B0D;color:#F0F0F0;padding:32px;border-radius:12px;"><h2>Registration Update</h2><p>Hi ${data.name},</p><p>Your AiraPropFirm registration has not been approved at this time.</p><p>Contact <a href="mailto:support@airapropfirm.com" style="color:#C9A84C;">support@airapropfirm.com</a> if you believe this is an error.</p><p style="color:#8A8F9E;margin-top:24px;">AiraPropFirm Team</p></div>` });
}

export async function sendPasswordResetEmail(email, tempPassword) {
  await send({ to: email, subject: `[AiraPropFirm] Password Reset`, html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A0B0D;color:#F0F0F0;padding:32px;border-radius:12px;"><h2>Password Reset</h2><p>Your password has been reset.</p><div style="background:#12141A;border:1px solid #C9A84C33;border-radius:10px;padding:24px;margin:20px 0;text-align:center;"><p style="color:#C9A84C;font-size:12px;text-transform:uppercase;letter-spacing:2px;">New Temporary Password</p><p style="font-size:28px;font-weight:bold;color:#F0F0F0;font-family:monospace;">${tempPassword}</p></div><p>Log in at <a href="${process.env.SITE_URL}" style="color:#C9A84C;">${process.env.SITE_URL}</a></p><p style="color:#8A8F9E;margin-top:24px;">AiraPropFirm Team</p></div>` });
}

export async function sendChallengeEmail(data) {
  if (!resend) {
    console.log('📧 Challenge application (email skipped):');
    console.log(`   Name: ${data.firstName} ${data.lastName} | Email: ${data.email} | Platform: ${data.platform}`);
    return;
  }
  await send({ to: process.env.ADMIN_EMAIL, subject: `[AiraPropFirm] New Challenge Application: ${data.firstName} ${data.lastName}`, html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0A0B0D;color:#F0F0F0;padding:32px;border-radius:12px;"><div style="text-align:center;margin-bottom:24px;"><div style="display:inline-block;background:#C9A84C;color:#0A0B0D;font-size:24px;font-weight:bold;width:44px;height:44px;line-height:44px;border-radius:10px;">A</div><h2 style="color:#F0F0F0;margin-top:12px;">🏆 New Challenge Application</h2></div><div style="background:#12141A;border:1px solid #1A1D26;border-radius:10px;padding:24px;margin-bottom:20px;"><table style="width:100%;border-collapse:collapse;"><tr><td style="color:#8A8F9E;padding:8px 0;border-bottom:1px solid #1A1D26;">Name</td><td style="color:#F0F0F0;padding:8px 0;border-bottom:1px solid #1A1D26;text-align:right;font-weight:600;">${data.firstName} ${data.lastName}</td></tr><tr><td style="color:#8A8F9E;padding:8px 0;border-bottom:1px solid #1A1D26;">Email</td><td style="color:#F0F0F0;padding:8px 0;border-bottom:1px solid #1A1D26;text-align:right;font-weight:600;">${data.email}</td></tr><tr><td style="color:#8A8F9E;padding:8px 0;border-bottom:1px solid #1A1D26;">Address</td><td style="color:#F0F0F0;padding:8px 0;border-bottom:1px solid #1A1D26;text-align:right;font-weight:600;">${data.address}</td></tr><tr><td style="color:#8A8F9E;padding:8px 0;border-bottom:1px solid #1A1D26;">Experience</td><td style="color:#F0F0F0;padding:8px 0;border-bottom:1px solid #1A1D26;text-align:right;font-weight:600;">${data.experience}</td></tr><tr><td style="color:#8A8F9E;padding:8px 0;border-bottom:1px solid #1A1D26;">Platform</td><td style="color:#C9A84C;padding:8px 0;border-bottom:1px solid #1A1D26;text-align:right;font-weight:600;">${data.platform}</td></tr><tr><td style="color:#8A8F9E;padding:8px 0;">Payment</td><td style="color:#2ECC71;padding:8px 0;text-align:right;font-weight:600;">${data.paymentMethod}</td></tr></table></div><div style="background:#C9A84C15;border:1px solid #C9A84C40;border-radius:10px;padding:20px;margin-bottom:20px;"><p style="color:#F0F0F0;margin:4px 0;">Fee: <strong>$1,050</strong> | Deposit: <strong>9,500 USDT</strong> | Method: <strong>${data.paymentMethod}</strong></p></div><p style="color:#8A8F9E;font-size:13px;">Submitted at ${new Date().toLocaleString()}</p></div>` });
}