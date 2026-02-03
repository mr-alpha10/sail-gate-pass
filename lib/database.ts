import prisma from "./prisma"
import type { Application, Department } from "./types"

// Helper to convert Prisma application to our Application type
function toApplication(app: {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  purpose: string
  department: string
  visitDate: string
  visitTime: string
  duration: string
  vehicleNumber: string | null
  status: string
  securityComments: string | null
  departmentComments: string | null
  approvedBy: string | null
  qrCode: string | null
  createdAt: Date
  updatedAt: Date
}): Application {
  return {
    id: app.id,
    userId: app.userId,
    userName: app.userName,
    userEmail: app.userEmail,
    userPhone: app.userPhone,
    purpose: app.purpose,
    department: app.department,
    visitDate: app.visitDate,
    visitTime: app.visitTime,
    duration: app.duration,
    vehicleNumber: app.vehicleNumber || undefined,
    status: app.status as "pending" | "forwarded" | "approved" | "rejected",
    securityComments: app.securityComments || undefined,
    departmentComments: app.departmentComments || undefined,
    approvedBy: app.approvedBy || undefined,
    qrCode: app.qrCode || undefined,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
  }
}

// Create a new application
export async function createApplication(
  application: Omit<Application, "id" | "createdAt" | "updatedAt">
): Promise<Application> {
  console.log("✅ Creating application:", application)

  const newApp = await prisma.application.create({
    data: {
      userId: application.userId,
      userName: application.userName,
      userEmail: application.userEmail,
      userPhone: application.userPhone,
      purpose: application.purpose,
      department: application.department,
      visitDate: application.visitDate,
      visitTime: application.visitTime,
      duration: application.duration,
      vehicleNumber: application.vehicleNumber || null,
      status: application.status,
      securityComments: application.securityComments || null,
      departmentComments: application.departmentComments || null,
      approvedBy: application.approvedBy || null,
      qrCode: application.qrCode || null,
    },
  })

  console.log("✅ Application created with ID:", newApp.id)
  return toApplication(newApp)
}

// Get all applications
export async function getApplications(): Promise<Application[]> {
  console.log("📋 Fetching all applications...")

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  })

  console.log(`📋 Found ${applications.length} applications`)
  return applications.map(toApplication)
}

// Get application by ID
export async function getApplicationById(id: string): Promise<Application | undefined> {
  console.log("🔍 Finding application by ID:", id)

  const app = await prisma.application.findUnique({
    where: { id },
  })

  if (!app) {
    console.log("❌ Application not found:", id)
    return undefined
  }

  console.log("✅ Found application:", app.id)
  return toApplication(app)
}

// Get applications by user ID
export async function getApplicationsByUser(userId: string): Promise<Application[]> {
  console.log("👤 Fetching applications for user:", userId)

  const applications = await prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  console.log(`👤 Found ${applications.length} applications for user ${userId}`)
  return applications.map(toApplication)
}

// Get applications by department (forwarded, approved, or rejected status)
export async function getApplicationsByDepartment(department: string): Promise<Application[]> {
  console.log("🏢 Fetching applications for department:", department)

  const applications = await prisma.application.findMany({
    where: {
      department,
      status: { in: ["forwarded", "approved", "rejected"] },
    },
    orderBy: { createdAt: "desc" },
  })

  console.log(`🏢 Found ${applications.length} applications for ${department}`)
  return applications.map(toApplication)
}

// Get ALL applications by department (any status)
export async function getAllApplicationsByDepartment(department: string): Promise<Application[]> {
  console.log("🏢 Fetching ALL applications for department:", department)

  const applications = await prisma.application.findMany({
    where: { department },
    orderBy: { createdAt: "desc" },
  })

  console.log(`🏢 Found ${applications.length} total applications for ${department}`)
  return applications.map(toApplication)
}

// Update application
export async function updateApplication(
  id: string,
  updates: Partial<Application>
): Promise<Application | null> {
  console.log("🔄 Updating application:", id, updates)

  try {
    const updatedApp = await prisma.application.update({
      where: { id },
      data: {
        status: updates.status,
        securityComments: updates.securityComments,
        departmentComments: updates.departmentComments,
        approvedBy: updates.approvedBy,
        qrCode: updates.qrCode,
      },
    })

    console.log("✅ Application updated:", updatedApp.id)
    return toApplication(updatedApp)
  } catch (error) {
    console.error("❌ Error updating application:", error)
    return null
  }
}

// Get applications by status
export async function getApplicationsByStatus(status: string): Promise<Application[]> {
  console.log("📊 Fetching applications with status:", status)

  const applications = await prisma.application.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
  })

  console.log(`📊 Found ${applications.length} applications with status ${status}`)
  return applications.map(toApplication)
}

// Get departments
export async function getDepartments(): Promise<Department[]> {
  console.log("🏢 Fetching departments...")

  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
  })

  return departments.map((d) => ({
    id: d.id,
    name: d.name,
    adminId: d.adminId || undefined,
  }))
}

// Generate QR code data for an application
export function generateQRCode(application: Application): string {
  console.log("🔄 Generating QR code for application:", application.id)

  const qrData = {
    type: "GATE_PASS",
    id: application.id,
    name: application.userName,
    email: application.userEmail,
    phone: application.userPhone,
    department: application.department,
    purpose: application.purpose,
    visitDate: application.visitDate,
    visitTime: application.visitTime,
    duration: application.duration,
    approvedBy: application.approvedBy,
    approvedAt: new Date().toISOString(),
    vehicleNumber: application.vehicleNumber || null,
    companyName: "SAIL - Steel Authority of India Limited",
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }

  const qrCodeData = JSON.stringify(qrData)
  console.log("✅ QR code data generated")

  return qrCodeData
}

// Get raw applications data for debugging
export async function getRawApplicationsData(): Promise<Application[]> {
  return getApplications()
}
