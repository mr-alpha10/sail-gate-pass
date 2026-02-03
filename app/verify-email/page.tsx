import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import VerifyEmailClient from "./verify-email-client"

export default async function VerifyEmailPage() {
  // Get pending verification email from cookie
  const cookieStore = await cookies()
  const pendingEmail = cookieStore.get("pendingVerificationEmail")?.value

  if (!pendingEmail) {
    redirect("/register")
  }

  return <VerifyEmailClient email={pendingEmail} />
}
