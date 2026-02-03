"use server"

import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

interface ProfileData {
  dateOfBirth: string
  gender: string
  governmentIdType: string
  governmentIdNumber: string
  address: string
  city: string
  state: string
  pincode: string
  profilePicture: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelation: string
  employeeId: string
  designation: string
  companyName: string
}

export async function completeProfileAction(email: string, data: ProfileData) {
  try {
    // Update user profile in database
    const updatedUser = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        governmentIdType: data.governmentIdType,
        governmentIdNumber: data.governmentIdNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        profilePicture: data.profilePicture || null,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactRelation: data.emergencyContactRelation,
        employeeId: data.employeeId || null,
        designation: data.designation || null,
        companyName: data.companyName || null,
        profileCompleted: true,
      },
    })

    console.log("✅ Profile completed for:", email)

    // Clear pending profile cookie
    const cookieStore = await cookies()
    cookieStore.delete("pendingProfileCompletion")

    // Set user session cookie
    cookieStore.set(
      "user",
      JSON.stringify({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        department: updatedUser.department,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      }
    )

    return { success: true }
  } catch (error) {
    console.error("❌ Error completing profile:", error)
    return { success: false, error: "Failed to save profile. Please try again." }
  }
}

export async function getProfileData(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        dateOfBirth: true,
        gender: true,
        governmentIdType: true,
        governmentIdNumber: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        profilePicture: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        emergencyContactRelation: true,
        employeeId: true,
        designation: true,
        companyName: true,
        profileCompleted: true,
      },
    })

    return { success: true, data: user }
  } catch (error) {
    console.error("❌ Error fetching profile:", error)
    return { success: false, error: "Failed to fetch profile" }
  }
}
