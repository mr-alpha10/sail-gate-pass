import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import ProfileDetailsClient from "./profile-details-client"

export default async function ProfileDetailsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <ProfileDetailsClient user={user} />
}
