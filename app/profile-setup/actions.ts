"use server"

import { cookies } from "next/headers"

export async function submitProfileAction(formData: FormData) {
  try {
    // Get session to check if user is logged in
    const session = cookies().get("session")
    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const user = JSON.parse(session.value)

    // Get form data
    const visitorName = formData.get("visitorName") as string
    const dob = formData.get("dob") as string
    const email = (formData.get("email") as string) || user.email
    const gender = formData.get("gender") as string
    const address = formData.get("address") as string
    const mobile = formData.get("mobile") as string
    const idType = formData.get("idType") as string
    const idNumber = formData.get("idNumber") as string
    const company = formData.get("company") as string
    const designation = formData.get("designation") as string

    // Validate required fields
    if (!visitorName || !dob || !email || !gender || !address || !mobile) {
      return { success: false, error: "Please fill all required fields" }
    }

    // In a real app, you would save this data to your database
    // For now, we'll just simulate success

    // Return success
    return {
      success: true,
      redirectTo: "/login",
    }
  } catch (error) {
    console.error("Profile setup error:", error)
    return { success: false, error: "Failed to save profile. Please try again." }
  }
}
