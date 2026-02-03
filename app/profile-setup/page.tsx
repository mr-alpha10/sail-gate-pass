import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ProfileSetupClient from "./profile-setup-client"

export default function ProfileSetupPage() {
  // Check if user is logged in
  const session = cookies().get("session")
  if (!session) {
    redirect("/login")
  }

  // Parse user data from session
  const user = JSON.parse(session.value)

  return <ProfileSetupClient user={user} />
}
