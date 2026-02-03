"use server"

import { cookies } from "next/headers"
import { authenticate, setUserSession } from "@/lib/auth"
import { generateOTP, sendOTPEmail } from "@/lib/email"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  const result = await authenticate(email, password)

  if (result.user) {
    // Check if email is verified
    if (!result.emailVerified) {
      // Send new OTP and redirect to verification
      const otp = generateOTP()
      await sendOTPEmail(email, otp, "registration", result.user.name)
      
      // Set cookie for verification page
      const cookieStore = await cookies()
      cookieStore.set("pendingVerificationEmail", email.toLowerCase(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      })

      return { 
        success: true, 
        needsVerification: true,
        redirectTo: "/verify-email"
      }
    }

    // Check if profile is completed
    if (!result.profileCompleted) {
      // Set cookie for profile completion
      const cookieStore = await cookies()
      cookieStore.set("pendingProfileCompletion", email.toLowerCase(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      })

      return { 
        success: true, 
        needsProfile: true,
        redirectTo: "/complete-profile"
      }
    }

    // All checks passed - set session and redirect based on role
    await setUserSession(result.user)
    return { success: true, role: result.user.role }
  } else {
    return { success: false, error: result.error || "Invalid credentials" }
  }
}
