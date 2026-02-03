"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { submitProfileAction } from "./actions"

export default function ProfileSetupClient({ user }: { user: any }) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState("No file chosen")
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    const result = await submitProfileAction(formData)

    if (result.success) {
      if (result.redirectTo) {
        router.push(result.redirectTo)
      } else {
        router.push("/login")
      }
    } else {
      setError(result.error || "Failed to save profile")
      setLoading(false)
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setFileName("No file chosen")
      setPhotoPreview(null)
    }
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white p-4 flex justify-between items-center border-b-2 border-[#1e3a8a]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Image src="/SAIL_LOGO_NEW.png" alt="SAIL Logo" width={100} height={50} />
          </div>
          <div className="max-w-[500px]">
            <h1 className="text-sm font-bold text-[#1e3a8a]">
              This is the official website of Steel Authority of India Limited (SAIL),
            </h1>
            <p className="text-xs text-gray-600">
              a Public Sector Undertaking under the Ministry of Steel, Government of India
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <a href="#main" className="text-sm underline text-[#1e3a8a]">
            Skip to main content
          </a>
          <div className="flex gap-2">
            <a href="#" className="text-sm text-[#3b82f6]">
              English
            </a>
            <a href="#" className="text-sm text-gray-600">
              Hindi
            </a>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#1e3a8a] p-4">
        <div className="relative max-w-[300px]">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">🔍</span>
          <input type="text" className="w-full py-2 px-10 rounded-full text-sm" placeholder="search" />
        </div>
      </nav>

      {/* Main Content */}
      <main id="main" className="max-w-[1200px] mx-auto p-10">
        <h1 className="text-center text-2xl font-normal tracking-[8px] text-gray-800 mb-10">
          STEEL AUTHORITY OF INDIA LIMITED
        </h1>

        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Visitor Profile</h2>
            <p className="text-sm text-gray-600">/Create Profile</p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label htmlFor="visitorName" className="text-sm font-medium text-gray-700 mb-2">
                  Visitor's Name<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="visitorName"
                  name="visitorName"
                  required
                  defaultValue={user?.name || ""}
                  className="p-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="dob" className="text-sm font-medium text-gray-700 mb-2">
                  Date Of Birth<span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  required
                  className="p-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">
                  Email ID<span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  defaultValue={user?.email || ""}
                  className="p-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="gender" className="text-sm font-medium text-gray-700 mb-2">
                  Gender<span className="text-red-600">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="p-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#3b82f6] bg-white"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex flex-col md:col-span-2">
                <label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2">
                  Address For Communication<span className="text-red-600">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  className="p-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#3b82f6] min-h-[80px] resize-y"
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label htmlFor="mobile" className="text-sm font-medium text-gray-700 mb-2">
                  Mobile Number<span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  required
                  defaultValue={user?.phone || ""}
                  className="p-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="idType" className="text-sm font-medium text-gray-700 mb-2">
                  Unique ID Proof
                </label>
                <select
                  id="idType"
                  name="idType"
                  className="p-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#3b82f6] bg-white"
                >
                  <option value="">Select</option>
                  <option value="aadhar">Aadhar Card</option>
                  <option value="pan">PAN Card</option>
                  <option value="passport">Passport</option>
                  <option value="driving-license">Driving License</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="idNumber" className="text-sm font-medium text-gray-700 mb-2">
                  Unique ID Proof Number
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  className="p-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="photo" className="text-sm font-medium text-gray-700 mb-2">
                  Upload Photo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <label
                    htmlFor="photo"
                    className="py-2 px-4 bg-gray-100 border-2 border-gray-300 rounded-md text-xs text-gray-600 cursor-pointer"
                  >
                    Choose file
                  </label>
                  <span className="text-xs text-gray-600">{fileName}</span>
                </div>
                {photoPreview && (
                  <div className="mt-2">
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="company" className="text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="p-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="designation" className="text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  className="p-3 border-2 border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm">{error}</div>}

            <div className="flex justify-start mt-8">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1e3a8a] text-white py-3 px-10 rounded-full text-base font-medium hover:bg-[#1e40af] transition-colors"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1e3a8a] text-white p-10 mt-12">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-base font-bold mb-4">Support</h3>
            <p className="text-sm text-gray-200 mb-2">
              ISPAT BHAWAN, H-Block, Shyamali Colony, Doranda, Ranchi, Jharkhand 834002
            </p>
            <p className="text-sm text-gray-200">0651 241 1106</p>
          </div>
          <div>
            <h3 className="text-base font-bold mb-4">Account</h3>
            <a href="#" className="text-sm text-gray-200 block mb-2 hover:text-white">
              My Account
            </a>
            <a href="/login" className="text-sm text-gray-200 block mb-2 hover:text-white">
              Login
            </a>
            <a href="/register" className="text-sm text-gray-200 block mb-2 hover:text-white">
              Register
            </a>
          </div>
          <div>
            <h3 className="text-base font-bold mb-4">Quick Link</h3>
            <a href="#" className="text-sm text-gray-200 block mb-2 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-200 block mb-2 hover:text-white">
              Terms Of Use
            </a>
            <a href="#" className="text-sm text-gray-200 block mb-2 hover:text-white">
              FAQ
            </a>
            <a href="#" className="text-sm text-gray-200 block mb-2 hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
