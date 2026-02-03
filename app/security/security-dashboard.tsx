"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { User, Application } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, Send, Eye } from "lucide-react"
import { forwardApplicationAction, logoutAction } from "./actions"

interface SecurityDashboardProps {
  user: User
  applications: Application[]
}

export default function SecurityDashboard({ user, applications }: SecurityDashboardProps) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [comments, setComments] = useState("")
  const [rejectionComments, setRejectionComments] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  console.log("🔒 Security Dashboard - All applications:", applications)

  const pendingApplications = applications.filter((app) => app.status === "pending")
  const rejectedApplications = applications.filter((app) => app.status === "rejected")
  const processedApplications = applications.filter((app) => app.status === "forwarded" || app.status === "approved")

  console.log("🔒 Security Dashboard - Pending applications:", pendingApplications)
  console.log("🔒 Security Dashboard - Processed applications:", processedApplications)

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

  async function handleForward(applicationId: string) {
    setLoading(true)
    const formData = new FormData()
    formData.append("applicationId", applicationId)
    formData.append("comments", comments)

    try {
      console.log("🚀 Forwarding application:", applicationId)
      const result = await forwardApplicationAction(formData)
      console.log("✅ Forward result:", result)

      setSelectedApp(null)
      setComments("")

      // Use router.refresh() instead of window.location.reload()
      router.refresh()
    } catch (error) {
      console.error("💥 Error forwarding application:", error)
      alert("Failed to forward application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleReject(applicationId: string) {
    setLoading(true)
    const formData = new FormData()
    formData.append("applicationId", applicationId)
    formData.append("action", "reject")
    formData.append("comments", rejectionComments)

    try {
      console.log("🚫 Rejecting application:", applicationId)
      const result = await forwardApplicationAction(formData)
      console.log("✅ Reject result:", result)

      setSelectedApp(null)
      setRejectionComments("")
      router.refresh()
    } catch (error) {
      console.error("💥 Error rejecting application:", error)
      alert("Failed to reject application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-gray-200 via-blue-600 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-06-02%20130517-kQ0EJiUxD5dCO0IcXRDVa5RHDVTbM1.png"
                alt="SAIL Logo"
                className="w-16 h-auto object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold">STEEL AUTHORITY OF INDIA LIMITED</h1>
                <p className="text-sm opacity-90">Gate Pass - Entry/Exit Control System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white">Welcome, {user.name}</span>
              <Button asChild variant="outline" size="sm" className="text-black">
                <a href="/debug" target="_blank" rel="noreferrer">
                  Debug View
                </a>
              </Button>
              <form action={logoutAction}>
                <Button variant="outline" size="sm" className="text-black">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Applications */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Pending Applications ({pendingApplications.length})
              </h2>
              <div className="space-y-4">
                {pendingApplications.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No pending applications</p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingApplications.map((application) => (
                    <Card key={application.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {application.userName} (#{application.id})
                          </CardTitle>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Purpose:</span> {application.purpose}
                          </div>
                          <div>
                            <span className="font-medium">Department:</span> {application.department}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {application.visitDate}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span> {application.visitTime}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {application.duration}
                          </div>
                          {application.vehicleNumber && (
                            <div>
                              <span className="font-medium">Vehicle:</span> {application.vehicleNumber}
                            </div>
                          )}
                        </div>

                        {selectedApp === application.id ? (
                          <div className="mt-4 space-y-3">
                            <Textarea
                              placeholder="Add comments for the department..."
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                            />
                            <Textarea
                              placeholder="Add rejection reason (if rejecting)..."
                              value={rejectionComments}
                              onChange={(e) => setRejectionComments(e.target.value)}
                            />
                            <div className="flex space-x-2">
                              <Button onClick={() => handleForward(application.id)} size="sm" disabled={loading}>
                                <Send className="h-4 w-4 mr-2" />
                                {loading ? "Forwarding..." : `Forward to ${application.department}`}
                              </Button>
                              <Button
                                onClick={() => handleReject(application.id)}
                                size="sm"
                                disabled={loading}
                                variant="destructive"
                              >
                                {loading ? "Rejecting..." : "Reject"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedApp(null)}
                                disabled={loading}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4">
                            <Button onClick={() => setSelectedApp(application.id)} size="sm" disabled={loading}>
                              <Eye className="h-4 w-4 mr-2" />
                              Review & Process
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Processed Applications */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Processed Applications ({processedApplications.length})
              </h2>
              <div className="space-y-4">
                {processedApplications.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No processed applications</p>
                    </CardContent>
                  </Card>
                ) : (
                  processedApplications.map((application) => (
                    <div
                      key={application.id}
                      className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {application.userName} (#{application.id})
                          </CardTitle>
                          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full">
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Purpose:</span> {application.purpose}
                          </div>
                          <div>
                            <span className="font-medium">Department:</span> {application.department}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {application.visitDate}
                          </div>
                          <div>
                            <span className="font-medium">Processed:</span>{" "}
                            {new Date(application.updatedAt).toLocaleString()}
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
                            <span className="font-medium text-green-800">Department Decision:</span>
                            <p className="text-green-700">{application.departmentComments}</p>
                            {application.approvedBy && (
                              <p className="text-green-600 text-xs mt-1">Decided by: {application.approvedBy}</p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* Rejected Applications */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Rejected Applications ({rejectedApplications.length})
              </h2>
              <div className="space-y-4">
                {rejectedApplications.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No rejected applications</p>
                    </CardContent>
                  </Card>
                ) : (
                  rejectedApplications.map((application) => (
                    <div
                      key={application.id}
                      className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-red-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {application.userName} (#{application.id})
                          </CardTitle>
                          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full">
                            Rejected
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Purpose:</span> {application.purpose}
                          </div>
                          <div>
                            <span className="font-medium">Department:</span> {application.department}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {application.visitDate}
                          </div>
                          <div>
                            <span className="font-medium">Rejected:</span>{" "}
                            {new Date(application.updatedAt).toLocaleString()}
                          </div>
                        </div>

                        {application.securityComments && (
                          <div className="mt-3 p-2 bg-red-50 rounded text-sm border-l-4 border-red-400">
                            <span className="font-medium text-red-800">Rejection Reason:</span>
                            <p className="text-red-700">{application.securityComments}</p>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
