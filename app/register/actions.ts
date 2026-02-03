"use server"

import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { generateOTP, sendOTPEmail } from "@/lib/email"

export async function registerAction(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const role = formData.get("role") as "user" | "security" | "department_admin"
    const department = formData.get("department") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validation
    if (!name || !email || !phone || !role || !password || !confirmPassword) {
      return { success: false, error: "All fields are required" }
    }

    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match" }
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long" }
    }

    if (role === "department_admin" && !department) {
      return { success: false, error: "Department is required for department admin role" }
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      // If user exists but email not verified, allow re-registration
      if (!existingUser.emailVerified) {
        // Delete the old unverified account
        await prisma.user.delete({
          where: { email: email.toLowerCase() },
        })
      } else {
        return { success: false, error: "Email already registered. Please login." }
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user in database (email not verified yet)
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        phone,
        password: hashedPassword,
        role,
        department: role === "department_admin" ? department : null,
        emailVerified: false,
        profileCompleted: false,
      },
    })

    console.log("✅ User created (pending verification):", newUser.email)

    // Generate OTP
    const otp = generateOTP()

    // Send OTP email with user's name
    const emailSent = await sendOTPEmail(email, otp, "registration", name)

    if (!emailSent) {
      // Delete user if OTP couldn't be sent
      await prisma.user.delete({ where: { id: newUser.id } })
      return { success: false, error: "Failed to send verification email. Please try again." }
    }

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
      message: "Registration successful! Please verify your email.",
      redirectTo: "/verify-email",
    }
  } catch (error) {
    console.error("❌ Registration error:", error)
    return { success: false, error: "Registration failed. Please try again." }
  }
}

export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { emailVerified: true },
    })
    
    // Only return true if user exists AND is verified
    return user?.emailVerified === true
  } catch (error) {
    console.error("❌ Error checking email:", error)
    return false
  }
}
