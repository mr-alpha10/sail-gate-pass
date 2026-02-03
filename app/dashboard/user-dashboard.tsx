"use client"

import { useState } from "react"
import type { User, Application } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, LogOut, QrCode, X } from "lucide-react"
import ApplicationForm from "./application-form"
import QRCodeDisplay from "@/components/qr-code-display"
import { logoutAction } from "./actions"

interface UserDashboardProps {
  user: User
  applications: Application[]
}

export default function UserDashboard({ user, applications }: UserDashboardProps) {
  const [showForm, setShowForm] = useState(false)

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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "Your application is waiting for security review"
      case "forwarded":
        return "Your application has been forwarded to the department for approval"
      case "approved":
        return "Your application has been approved! Use the QR code below for gate entry"
      case "rejected":
        return "Your application has been rejected. Please check the comments below"
      default:
        return ""
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">My Applications</h2>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>

          {showForm && (
            <div className="mb-6">
              <ApplicationForm
                userId={user.id}
                userName={user.name}
                userEmail={user.email}
                userPhone={user.phone}
                onClose={() => setShowForm(false)}
              />
            </div>
          )}

          <div className="grid gap-6">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No applications found. Create your first application!</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((application) => {
                if (application.status === "approved" && application.qrCode) {
                  return (
                    <div key={application.id} className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
                      <div className="flex items-center justify-center mb-6">
                        <QrCode className="h-8 w-8 text-green-600 mr-3" />
                        <span className="font-bold text-green-800 text-2xl">Gate Pass Approved!</span>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-2/5 flex flex-col items-center justify-start p-4 bg-slate-50 rounded-xl shadow">
                          <QRCodeDisplay
                            data={application.qrCode}
                            size={180}
                            applicationId={application.id}
                            userName={application.userName}
                            department={application.department}
                            visitDate={application.visitDate}
                            visitTime={application.visitTime}
                          />
                        </div>

                        <div className="lg:w-3/5 p-4 bg-slate-50 rounded-xl shadow space-y-3 text-sm">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                            Application Details
                          </h3>

                          <div>
                            <span className="font-medium text-gray-700">Applicant:</span> {application.userName}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Email:</span> {application.userEmail}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Phone:</span> {application.userPhone}
                          </div>
                          <div className="pt-2 mt-2 border-t">
                            <span className="font-medium text-gray-700">Purpose of Visit:</span> {application.purpose}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Department:</span> {application.department}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Visit Date:</span> {application.visitDate}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Visit Time:</span> {application.visitTime}
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Duration:</span> {application.duration}
                          </div>
                          {application.vehicleNumber && (
                            <div>
                              <span className="font-medium text-gray-700">Vehicle Number:</span>{" "}
                              {application.vehicleNumber}
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-700">Applied On:</span>{" "}
                            {new Date(application.createdAt).toLocaleDateString()}
                          </div>

                          {application.securityComments && (
                            <div className="mt-3 pt-3 border-t">
                              <h4 className="font-medium text-gray-700 text-xs mb-1">Security Comments:</h4>
                              <p className="text-gray-600 text-xs p-2 bg-blue-50 rounded">
                                {application.securityComments}
                              </p>
                            </div>
                          )}

                          {application.departmentComments && (
                            <div className="mt-3 pt-3 border-t">
                              <h4 className="font-medium text-gray-700 text-xs mb-1">
                                {application.department} Department Comments:
                              </h4>
                              <p className="text-gray-600 text-xs p-2 bg-green-50 rounded">
                                {application.departmentComments}
                              </p>
                              {application.approvedBy && (
                                <p className="text-gray-500 text-xs mt-1">Processed by: {application.approvedBy}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <Card key={application.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {application.purpose} (#{application.id})
                          </CardTitle>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{getStatusMessage(application.status)}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Department:</span> {application.department}
                          </div>
                          <div>
                            <span className="font-medium">Visit Date:</span> {application.visitDate}
                          </div>
                          <div>
                            <span className="font-medium">Visit Time:</span> {application.visitTime}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {application.duration}
                          </div>
                          {application.vehicleNumber && (
                            <div>
                              <span className="font-medium">Vehicle:</span> {application.vehicleNumber}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Applied:</span>{" "}
                            {new Date(application.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {application.securityComments && (
                          <div className="mt-4 p-3 bg-blue-50 rounded">
                            <span className="font-medium text-blue-800">Security Comments:</span>
                            <p className="text-blue-700 mt-1">{application.securityComments}</p>
                          </div>
                        )}

                        {application.departmentComments && (
                          <div className="mt-4 p-3 bg-green-50 rounded">
                            <span className="font-medium text-green-800">
                              {application.department} Department Comments:
                            </span>
                            <p className="text-green-700 mt-1">{application.departmentComments}</p>
                            {application.approvedBy && (
                              <p className="text-green-600 text-sm mt-1">Processed by: {application.approvedBy}</p>
                            )}
                          </div>
                        )}

                        {application.status === "rejected" && (
                          <div className="mt-4 p-4 bg-red-50 rounded border-2 border-red-200">
                            <div className="flex items-center justify-center mb-2">
                              <X className="h-5 w-5 text-red-600 mr-2" />
                              <span className="font-medium text-red-800">Application Rejected</span>
                            </div>
                            <p className="text-sm text-red-700 text-center">
                              Please review the department comments above and submit a new application if needed.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                }
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
