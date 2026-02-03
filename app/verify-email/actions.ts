"use server"

import { verifyOTP, resendOTP } from "@/lib/email"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export async function verifyOTPAction(email: string, otp: string) {
  try {
    const result = await verifyOTP(email, otp)

    if (result.success) {
      // Clear the pending verification cookie
      const cookieStore = await cookies()
      cookieStore.delete("pendingVerificationEmail")
      
      // Set a cookie to indicate user needs to complete profile
      cookieStore.set("pendingProfileCompletion", email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      })

      return { success: true }
    }

    return { success: false, error: result.error }
  } catch (error) {
    console.error("❌ OTP verification error:", error)
    return { success: false, error: "Verification failed. Please try again." }
  }
}

export async function resendOTPAction(email: string) {
  try {
    const result = await resendOTP(email)
    return result
  } catch (error) {
    console.error("❌ Resend OTP error:", error)
    return { success: false, error: "Failed to resend OTP. Please try again." }
  }
}

export async function checkVerificationStatus(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { emailVerified: true, profileCompleted: true },
    })

    return {
      exists: !!user,
      emailVerified: user?.emailVerified || false,
      profileCompleted: user?.profileCompleted || false,
    }
  } catch (error) {
    console.error("❌ Error checking verification status:", error)
    return { exists: false, emailVerified: false, profileCompleted: false }
  }
}
