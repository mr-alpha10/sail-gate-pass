import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import CompleteProfileClient from "./complete-profile-client"

export default async function CompleteProfilePage() {
  // Get pending profile completion email from cookie
  const cookieStore = await cookies()
  const pendingEmail = cookieStore.get("pendingProfileCompletion")?.value

  if (!pendingEmail) {
    // Check if user is logged in
    const userCookie = cookieStore.get("user")?.value
    if (userCookie) {
      const user = JSON.parse(userCookie)
      // Check if profile is already completed
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { profileCompleted: true, email: true },
      })
      
      if (dbUser?.profileCompleted) {
        redirect("/dashboard")
      }
      
      return <CompleteProfileClient email={dbUser?.email || user.email} />
    }
    redirect("/register")
  }

  // Check if user exists and email is verified
  const user = await prisma.user.findUnique({
    where: { email: pendingEmail.toLowerCase() },
    select: { emailVerified: true, profileCompleted: true },
  })

  if (!user) {
    redirect("/register")
  }

  if (!user.emailVerified) {
    redirect("/verify-email")
  }

  if (user.profileCompleted) {
    redirect("/dashboard")
  }

  return <CompleteProfileClient email={pendingEmail} />
}
