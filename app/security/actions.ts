"use server"

import { redirect } from "next/navigation"
import { updateApplication, getApplicationById, getApplications } from "@/lib/database"
import { clearUserSession } from "@/lib/auth"

export async function forwardApplicationAction(formData: FormData) {
  try {
    const applicationId = formData.get("applicationId") as string
    const comments = formData.get("comments") as string
    const action = formData.get("action") as string

    console.log("🚀 Starting forwardApplicationAction")
    console.log("📝 Application ID:", applicationId)
    console.log("💬 Comments:", comments)
    console.log("🎯 Action:", action)

    // Check if application exists before updating
    const existingApp = await getApplicationById(applicationId)
    console.log("🔍 Found existing application:", existingApp)

    if (!existingApp) {
      console.log("❌ Application not found!")
      throw new Error(`Application with ID ${applicationId} not found`)
    }

    // Handle different actions
    let newStatus = "forwarded"
    if (action === "reject") {
      newStatus = "rejected"
      console.log("🔄 Updating application status to 'rejected'...")
    } else {
      console.log("🔄 Updating application status to 'forwarded'...")
    }

    const result = await updateApplication(applicationId, {
      status: newStatus,
      securityComments: comments,
    })

    if (!result) {
      console.log("❌ Failed to update application")
      throw new Error("Failed to update application")
    }

    console.log("✅ Application processed successfully:", result)

    // Verify the update worked
    const updatedApp = await getApplicationById(applicationId)
    console.log("🔍 Verification - Updated application:", updatedApp)

    // Show all applications after update
    const allApps = await getApplications()
    console.log("📊 All applications after update:", allApps)

    return { success: true, application: result }
  } catch (error) {
    console.error("💥 Error in forwardApplicationAction:", error)
    throw error
  }
}

export async function logoutAction() {
  await clearUserSession()
  redirect("/login")
}
