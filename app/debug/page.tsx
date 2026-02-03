import { getApplications, getApplicationsByStatus, getRawApplicationsData } from "@/lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DebugClient from "./debug-client"

// Force dynamic rendering to prevent prerendering issues
export const dynamic = "force-dynamic"
export const revalidate = false

export default async function DebugPage() {
  const allApplications = await getApplications()
  const rawApplications = await getRawApplicationsData()
  const pendingApps = await getApplicationsByStatus("pending")
  const forwardedApps = await getApplicationsByStatus("forwarded")
  const approvedApps = await getApplicationsByStatus("approved")
  const rejectedApps = await getApplicationsByStatus("rejected")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "forwarded":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Group applications by department
  const applicationsByDepartment = allApplications.reduce(
    (acc, app) => {
      if (!acc[app.department]) {
        acc[app.department] = []
      }
      acc[app.department].push(app)
      return acc
    },
    {} as Record<string, typeof allApplications>,
  )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Debug - All Applications</h1>
          <DebugClient />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{allApplications.length}</p>
              <p className="text-xs text-gray-500">Raw count: {rawApplications.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">{pendingApps.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Forwarded</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{forwardedApps.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{approvedApps.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">{rejectedApps.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications by Department */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Applications by Department</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(applicationsByDepartment).map(([department, apps]) => (
              <Card key={department}>
                <CardHeader>
                  <CardTitle>{department} Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-bold">{apps.length} applications</p>
                  <div className="mt-2 space-y-1">
                    {apps.map((app) => (
                      <div key={app.id} className="flex justify-between items-center text-sm">
                        <span>#{app.id}</span>
                        <Badge className={getStatusColor(app.status)} variant="secondary">
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">All Applications (Detailed View)</h2>
          {allApplications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No applications found</p>
                <p className="text-xs text-gray-400 mt-2">Raw applications count: {rawApplications.length}</p>
              </CardContent>
            </Card>
          ) : (
            allApplications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      #{application.id} - {application.userName} - {application.purpose}
                    </CardTitle>
                    <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">ID:</span> {application.id}
                    </div>
                    <div>
                      <span className="font-medium">User ID:</span> {application.userId}
                    </div>
                    <div>
                      <span className="font-medium">Department:</span> {application.department}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {application.status}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {application.visitDate}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {application.visitTime}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {new Date(application.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span> {new Date(application.updatedAt).toLocaleString()}
                    </div>
                  </div>

                  {application.securityComments && (
                    <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                      <span className="font-medium text-blue-800">Security Comments:</span>
                      <p className="text-blue-700">{application.securityComments}</p>
                    </div>
                  )}

                  {application.departmentComments && (
                    <div className="mt-3 p-2 bg-green-50 rounded text-sm">
                      <span className="font-medium text-green-800">Department Comments:</span>
                      <p className="text-green-700">{application.departmentComments}</p>
                    </div>
                  )}

                  {application.qrCode && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                      <span className="font-medium">QR Code:</span>
                      <p className="font-mono text-xs">{application.qrCode.slice(0, 100)}...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
