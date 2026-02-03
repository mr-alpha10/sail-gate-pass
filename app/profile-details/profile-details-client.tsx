"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Printer, Edit, UserX } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types"

interface ProfileDetailsClientProps {
  user: User
}

export default function ProfileDetailsClient({ user }: ProfileDetailsClientProps) {
  const [profileData] = useState({
    id: "VP2024001",
    name: user.name,
    dob: "15th March, 1985",
    email: user.email,
    gender: "Male",
    mobile: user.phone,
    uniqueIdType: "Aadhar Card",
    uniqueIdNumber: "XXXX XXXX 5678",
    company: "Tech Solutions Pvt. Ltd.",
    designation: "Senior Software Engineer",
    address: "Flat No. 204, Sunrise Apartments,\nSector 15, Rohini,\nNew Delhi - 110085",
    status: "Active",
    registrationDate: "9th June, 2025",
    lastUpdated: "9th June, 2025",
  })

  const handleEditProfile = () => {
    alert("Redirecting to edit profile page...")
  }

  const handleDownloadProfile = () => {
    alert("Downloading profile details as PDF...")
  }

  const handlePrintProfile = () => {
    window.print()
  }

  const handleDeactivateProfile = () => {
    if (confirm("Are you sure you want to deactivate this profile? This action cannot be undone.")) {
      alert("Profile deactivated successfully.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#1e3a8a]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SAIL_LOGO_NEW-m0CwzIcnV72DvxDKenyVq86qhqCz1Q.png"
                  alt="SAIL Logo"
                  className="w-24 h-auto object-contain"
                />
              </div>
              <div className="max-w-md">
                <h1 className="text-sm font-bold text-[#1e3a8a]">
                  This is the official website of Steel Authority of India Limited (SAIL),
                </h1>
                <p className="text-xs text-gray-600">
                  a Public Sector Undertaking under the Ministry of Steel, Government of India
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <Link href="#main" className="text-sm text-[#1e3a8a] underline">
                Skip to main content
              </Link>
              <div className="flex gap-2">
                <Link href="#" className="text-sm text-blue-500">
                  English
                </Link>
                <span className="text-gray-400">|</span>
                <Link href="#" className="text-sm text-gray-600">
                  Hindi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#1e3a8a] py-3">
        <div className="container mx-auto px-4">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input type="search" placeholder="search" className="pl-10 rounded-full bg-white border-none" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main" className="container mx-auto px-4 py-10">
        <h1 className="text-center text-3xl font-normal tracking-[8px] text-gray-800 mb-10">
          STEEL AUTHORITY OF INDIA LIMITED
        </h1>

        <Card className="max-w-4xl mx-auto rounded-2xl shadow-lg">
          <CardHeader className="bg-gray-50 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Visitor Profile Details</h2>
              </div>
              <Badge variant="secondary" className="bg-gray-200 text-gray-700 px-4 py-1 rounded-full">
                ID: {profileData.id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {/* Profile Photo */}
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full border-4 border-[#1e3a8a] bg-gray-100 flex items-center justify-center text-5xl text-gray-400">
                👤
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#1e3a8a]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Visitor's Name</div>
                <div className="text-base font-medium text-gray-900">{profileData.name}</div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#1e3a8a]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Date of Birth</div>
                <div className="text-base font-medium text-gray-900">{profileData.dob}</div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#1e3a8a]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email ID</div>
                <div className="text-base font-medium text-gray-900">{profileData.email}</div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#1e3a8a]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Gender</div>
                <div className="text-base font-medium text-gray-900">{profileData.gender}</div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#1e3a8a]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mobile Number</div>
                <div className="text-base font-medium text-gray-900">{profileData.mobile}</div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#1e3a8a]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Unique ID Proof</div>
                <div className="text-base font-medium text-gray-900">{profileData.uniqueIdType}</div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#1e3a8a]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Unique ID Proof Number
                </div>
                <div className="text-base font-medium text-gray-900">{profileData.uniqueIdNumber}</div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#1e3a8a]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Company Name</div>
                <div className="text-base font-medium text-gray-900">{profileData.company}</div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#1e3a8a]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Designation</div>
                <div className="text-base font-medium text-gray-900">{profileData.designation}</div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#1e3a8a]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Profile Status</div>
                <div className="text-base font-medium text-gray-900">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{profileData.status}</Badge>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#1e3a8a]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Registration Date
                </div>
                <div className="text-base font-medium text-gray-900">{profileData.registrationDate}</div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#1e3a8a]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Last Updated</div>
                <div className="text-base font-medium text-gray-900">{profileData.lastUpdated}</div>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-[#1e3a8a] mb-8">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Address for Communication
              </div>
              <div className="text-base font-medium text-gray-900 whitespace-pre-line">{profileData.address}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={handleEditProfile}
                className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-8 py-3 rounded-full font-medium"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                onClick={handleDownloadProfile}
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Details
              </Button>
              <Button
                onClick={handlePrintProfile}
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full font-medium"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Profile
              </Button>
              <Button
                onClick={handleDeactivateProfile}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium"
              >
                <UserX className="w-4 h-4 mr-2" />
                Deactivate Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-[#1e3a8a] text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                ISPAT BHAWAN, H-Block, Shyamali Colony, Doranda, Ranchi, Jharkhand 834002
              </p>
              <p className="text-sm text-gray-300 mt-4">0651 241 1106</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Account</h3>
              <div className="space-y-2">
                <Link href="/dashboard" className="block text-sm text-gray-300 hover:text-white">
                  My Account
                </Link>
                <Link href="/login" className="block text-sm text-gray-300 hover:text-white">
                  Login
                </Link>
                <Link href="/register" className="block text-sm text-gray-300 hover:text-white">
                  Register
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Link</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="#" className="block text-sm text-gray-300 hover:text-white">
                  Terms Of Use
                </Link>
                <Link href="#" className="block text-sm text-gray-300 hover:text-white">
                  FAQ
                </Link>
                <Link href="#" className="block text-sm text-gray-300 hover:text-white">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
