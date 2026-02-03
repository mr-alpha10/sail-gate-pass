import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getApplicationsByDepartment, getAllApplicationsByDepartment, getApplications } from "@/lib/database"
import DepartmentDashboard from "./department-dashboard"

// Add this to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DepartmentPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "department_admin" || !user.department) {
    redirect("/login")
  }

  console.log("🏢 Department page loading for:", user.name, "Department:", user.department)

  // Get all applications first to see what's available
  const allApplications = await getApplications()
  console.log("📊 All applications in system:", allApplications)

  // Get applications for this specific department
  const departmentApplications = await getApplicationsByDepartment(user.department)
  console.log(`🏢 Applications for ${user.department} department:`, departmentApplications)

  // Also try the other function
  const allDeptApplications = await getAllApplicationsByDepartment(user.department)
  console.log(`🏢 ALL applications for ${user.department} department:`, allDeptApplications)

  return <DepartmentDashboard user={user} applications={departmentApplications} />
}
