// Email Service for OTP Verification
// Supports real email via SMTP (Gmail, Outlook, etc.) or console logging for demo

import nodemailer from "nodemailer"
import prisma from "./prisma"

// Check if real email is enabled
const isEmailEnabled = process.env.EMAIL_ENABLED === "true"

// Create email transporter
function createTransporter() {
  if (!isEmailEnabled) {
    return null
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

// Generate a 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Email template for OTP
function getOTPEmailHTML(otp: string, type: "registration" | "password_reset", userName?: string): string {
  const title = type === "registration" ? "Verify Your Email" : "Reset Your Password"
  const message = type === "registration" 
    ? "Thank you for registering with SAIL Gate Pass System. Please use the OTP below to verify your email address."
    : "We received a request to reset your password. Please use the OTP below to proceed."

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f7fa;">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3a2e5c 0%, #1e1a3a 100%); padding: 30px 40px; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                🏢 SAIL Gate Pass System
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1e1a3a; font-size: 22px;">
                ${title}
              </h2>
              
              ${userName ? `<p style="margin: 0 0 20px; color: #4a5568; font-size: 16px;">Hello <strong>${userName}</strong>,</p>` : ''}
              
              <p style="margin: 0 0 30px; color: #4a5568; font-size: 16px; line-height: 1.6;">
                ${message}
              </p>
              
              <!-- OTP Box -->
              <div style="background: linear-gradient(135deg, #f0f4ff 0%, #e8efff 100%); border: 2px dashed #3a2e5c; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
                <p style="margin: 0 0 10px; color: #4a5568; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Your One-Time Password
                </p>
                <p style="margin: 0; color: #3a2e5c; font-size: 42px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </p>
              </div>
              
              <!-- Expiry Warning -->
              <div style="background-color: #fff8e6; border-left: 4px solid #f6ad55; padding: 15px 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
                <p style="margin: 0; color: #744210; font-size: 14px;">
                  ⏱️ <strong>This OTP is valid for 10 minutes only.</strong>
                </p>
              </div>
              
              <p style="margin: 30px 0 0; color: #718096; font-size: 14px; line-height: 1.6;">
                If you didn't request this, please ignore this email or contact support if you have concerns.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; border-radius: 0 0 12px 12px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #718096; font-size: 12px; text-align: center;">
                This is an automated message from SAIL Gate Pass System.
              </p>
              <p style="margin: 0; color: #a0aec0; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} Steel Authority of India Limited. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

// Plain text version of email
function getOTPEmailText(otp: string, type: "registration" | "password_reset", userName?: string): string {
  const title = type === "registration" ? "Email Verification" : "Password Reset"
  const message = type === "registration" 
    ? "Thank you for registering with SAIL Gate Pass System."
    : "We received a request to reset your password."

  return `
SAIL Gate Pass System - ${title}

${userName ? `Hello ${userName},` : 'Hello,'}

${message}

Your One-Time Password (OTP) is:

    ${otp}

This OTP is valid for 10 minutes only.

If you didn't request this, please ignore this email.

---
This is an automated message from SAIL Gate Pass System.
© ${new Date().getFullYear()} Steel Authority of India Limited
`
}

// Log OTP to console (for demo/development)
function logOTPToConsole(email: string, otp: string, type: "registration" | "password_reset"): void {
  console.log("")
  console.log("═══════════════════════════════════════════════════════════════════")
  console.log("📧 EMAIL SENT (Demo Mode - Check Console)")
  console.log("═══════════════════════════════════════════════════════════════════")
  console.log(`To: ${email}`)
  console.log(`Subject: ${type === "registration" ? "Verify Your Email" : "Reset Your Password"} - SAIL Gate Pass`)
  console.log("───────────────────────────────────────────────────────────────────")
  console.log("")
  console.log("  Dear User,")
  console.log("")
  console.log(`  Your OTP for ${type === "registration" ? "email verification" : "password reset"} is:`)
  console.log("")
  console.log("  ╔═══════════════════════╗")
  console.log(`  ║       ${otp}          ║`)
  console.log("  ╚═══════════════════════╝")
  console.log("")
  console.log("  ⏱️  This OTP is valid for 10 minutes.")
  console.log("")
  console.log("  If you didn't request this, please ignore this email.")
  console.log("")
  console.log("  Regards,")
  console.log("  SAIL Gate Pass System")
  console.log("")
  console.log("═══════════════════════════════════════════════════════════════════")
  console.log("💡 TIP: To send REAL emails, set EMAIL_ENABLED=true in .env")
  console.log("═══════════════════════════════════════════════════════════════════")
  console.log("")
}

// Send OTP email
export async function sendOTPEmail(
  email: string, 
  otp: string, 
  type: "registration" | "password_reset",
  userName?: string
): Promise<boolean> {
  try {
    // Calculate expiry (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    
    // Store OTP in database
    await prisma.otpLog.create({
      data: {
        email: email.toLowerCase(),
        otp,
        type,
        expiresAt,
      },
    })

    // Update user's OTP fields
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        otp,
        otpExpiry: expiresAt,
      },
    })

    // Check if real email is enabled
    if (isEmailEnabled) {
      // Send real email via SMTP
      const transporter = createTransporter()
      
      if (!transporter) {
        console.error("❌ Email transporter not configured")
        logOTPToConsole(email, otp, type)
        return true
      }

      const fromName = process.env.EMAIL_FROM_NAME || "SAIL Gate Pass System"
      const fromAddress = process.env.SMTP_USER || "noreply@sail.com"

      const mailOptions = {
        from: `"${fromName}" <${fromAddress}>`,
        to: email,
        subject: type === "registration" 
          ? "🔐 Verify Your Email - SAIL Gate Pass System" 
          : "🔑 Reset Your Password - SAIL Gate Pass System",
        text: getOTPEmailText(otp, type, userName),
        html: getOTPEmailHTML(otp, type, userName),
      }

      const info = await transporter.sendMail(mailOptions)
      console.log("✅ Email sent successfully!")
      console.log("   Message ID:", info.messageId)
      console.log("   To:", email)
      
      return true
    } else {
      // Demo mode - log to console
      logOTPToConsole(email, otp, type)
      return true
    }
  } catch (error) {
    console.error("❌ Error sending OTP email:", error)
    
    // Fallback to console logging
    logOTPToConsole(email, otp, type)
    return true // Return true so the flow continues in demo mode
  }
}

// Verify OTP
export async function verifyOTP(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    if (!user.otp || !user.otpExpiry) {
      return { success: false, error: "No OTP requested. Please request a new one." }
    }

    // Check if OTP has expired
    if (new Date() > user.otpExpiry) {
      return { success: false, error: "OTP has expired. Please request a new one." }
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return { success: false, error: "Invalid OTP. Please check and try again." }
    }

    // Mark email as verified and clear OTP
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        emailVerified: true,
        otp: null,
        otpExpiry: null,
      },
    })

    // Mark OTP as used in log
    await prisma.otpLog.updateMany({
      where: {
        email: email.toLowerCase(),
        otp,
        used: false,
      },
      data: {
        used: true,
      },
    })

    console.log("✅ OTP verified successfully for:", email)
    return { success: true }
  } catch (error) {
    console.error("❌ Error verifying OTP:", error)
    return { success: false, error: "Verification failed. Please try again." }
  }
}

// Resend OTP
export async function resendOTP(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return { success: false, error: "User not found" }
    }

    if (user.emailVerified) {
      return { success: false, error: "Email is already verified" }
    }

    // Generate new OTP
    const newOTP = generateOTP()
    
    // Send new OTP
    const sent = await sendOTPEmail(email, newOTP, "registration", user.name)
    
    if (!sent) {
      return { success: false, error: "Failed to send OTP. Please try again." }
    }

    return { success: true }
  } catch (error) {
    console.error("❌ Error resending OTP:", error)
    return { success: false, error: "Failed to resend OTP" }
  }
}

// Send password reset OTP
export async function sendPasswordResetOTP(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return { success: true }
    }

    // Generate OTP
    const otp = generateOTP()
    
    // Send OTP
    const sent = await sendOTPEmail(email, otp, "password_reset", user.name)
    
    if (!sent) {
      return { success: false, error: "Failed to send OTP. Please try again." }
    }

    return { success: true }
  } catch (error) {
    console.error("❌ Error sending password reset OTP:", error)
    return { success: false, error: "Failed to send OTP" }
  }
}

// Test email configuration
export async function testEmailConfiguration(): Promise<{ success: boolean; error?: string }> {
  if (!isEmailEnabled) {
    return { 
      success: false, 
      error: "Email is disabled. Set EMAIL_ENABLED=true in .env to enable." 
    }
  }

  try {
    const transporter = createTransporter()
    
    if (!transporter) {
      return { success: false, error: "Transporter not configured" }
    }

    // Verify connection
    await transporter.verify()
    
    console.log("✅ Email configuration is valid!")
    return { success: true }
  } catch (error: any) {
    console.error("❌ Email configuration error:", error.message)
    return { 
      success: false, 
      error: `Email configuration failed: ${error.message}` 
    }
  }
}
