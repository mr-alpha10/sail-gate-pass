"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { User, Application } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, Check, X, QrCode } from "lucide-react"
import QRCodeDisplay from "@/components/qr-code-display"
import { approveApplicationAction, rejectApplicationAction, logoutAction } from "./actions"

interface DepartmentDashboardProps {
  user: User
  applications: Application[]
}

export default function DepartmentDashboard({ user, applications }: DepartmentDashboardProps) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [comments, setComments] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  console.log(`🏢 ${user.department} Department Dashboard - All applications:`, applications)

  // Filter applications properly
  const forwardedApplications = applications.filter((app) => app.status === "forwarded")
  const processedApplications = applications.filter((app) => app.status === "approved" || app.status === "rejected")

  console.log(`🏢 ${user.department} Department Dashboard - Forwarded applications:`, forwardedApplications)
  console.log(`🏢 ${user.department} Department Dashboard - Processed applications:`, processedApplications)

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

  async function handleDecision(applicationId: string, decision: "approve" | "reject") {
    setLoading(true)
    const formData = new FormData()
    formData.append("applicationId", applicationId)
    formData.append("comments", comments)
    formData.append("approvedBy", user.name)

    try {
      console.log(`🔄 Processing ${decision} for application:`, applicationId)

      let result
      if (decision === "approve") {
        result = await approveApplicationAction(formData)
      } else {
        result = await rejectApplicationAction(formData)
      }

      console.log(`✅ ${decision} result:`, result)

      setSelectedApp(null)
      setComments("")

      // Use router.refresh() instead of window.location.reload()
      router.refresh()
    } catch (error) {
      console.error(`💥 Error processing ${decision}:`, error)
      alert(`Failed to ${decision} application. Please try again.`)
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
              <span className="text-sm text-white">
                Welcome, {user.name} ({user.department} Department)
              </span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Review */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Pending Review ({forwardedApplications.length})
              </h2>
              <div className="space-y-4">
                {forwardedApplications.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-gray-500">No applications pending review</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Applications will appear here after security forwards them to {user.department}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  forwardedApplications.map((application) => (
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
                            <span className="font-medium">Email:</span> {application.userEmail}
                          </div>
                          <div>
                            <span className="font-medium">Phone:</span> {application.userPhone}
                          </div>
                          <div>
                            <span className="font-medium">Purpose:</span> {application.purpose}
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

                        {application.securityComments && (
                          <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                            <span className="font-medium text-blue-800">Security Comments:</span>
                            <p className="text-blue-700">{application.securityComments}</p>
                          </div>
                        )}

                        {selectedApp === application.id ? (
                          <div className="mt-4 space-y-3">
                            <Textarea
                              placeholder="Add your decision comments..."
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                            />
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleDecision(application.id, "approve")}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                disabled={loading}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                {loading ? "Approving..." : "Approve & Generate QR"}
                              </Button>
                              <Button
                                onClick={() => handleDecision(application.id, "reject")}
                                size="sm"
                                variant="destructive"
                                disabled={loading}
                              >
                                <X className="h-4 w-4 mr-2" />
                                {loading ? "Rejecting..." : "Reject"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedApp(null)
                                  setComments("")
                                }}
                                disabled={loading}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4">
                            <Button onClick={() => setSelectedApp(application.id)} size="sm" disabled={loading}>
                              Review Application
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
                          <Badge className={`${getStatusColor(application.status)} px-3 py-1 rounded-full`}>
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
                            <span className="font-medium">Date:</span> {application.visitDate}
                          </div>
                          <div>
                            <span className="font-medium">Decision by:</span> {application.approvedBy}
                          </div>
                          <div>
                            <span className="font-medium">Processed:</span>{" "}
                            {new Date(application.updatedAt).toLocaleString()}
                          </div>
                        </div>

                        {application.departmentComments && (
                          <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                            <span className="font-medium">Your Comments:</span>
                            <p>{application.departmentComments}</p>
                          </div>
                        )}

                        {application.status === "approved" && application.qrCode && (
                          <div className="mt-4 p-3 bg-green-50 rounded text-sm">
                            <div className="flex items-center mb-3">
                              <QrCode className="h-4 w-4 text-green-600 mr-2" />
                              <span className="text-green-800 font-medium">QR Code Generated & Sent to User</span>
                            </div>

                            <div className="flex justify-center">
                              <QRCodeDisplay
                                data={application.qrCode}
                                size={120}
                                applicationId={application.id}
                                userName={application.userName}
                                department={application.department}
                                visitDate={application.visitDate}
                                visitTime={application.visitTime}
                              />
                            </div>

                            <p className="text-green-700 text-xs mt-2 text-center">
                              User can now see this QR code in their dashboard for gate entry
                            </p>
                          </div>
                        )}

                        {application.status === "rejected" && (
                          <div className="mt-3 p-2 bg-red-50 rounded text-sm">
                            <span className="text-red-800 font-medium">Application Rejected</span>
                            <p className="text-red-700 text-xs mt-1">User has been notified of the rejection</p>
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
