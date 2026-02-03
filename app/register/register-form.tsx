"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { registerAction } from "./actions"

export default function RegisterForm() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState("")
  const [department, setDepartment] = useState("")
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    // Add role and department to form data
    formData.append("role", role)
    if (department) {
      formData.append("department", department)
    }

    const result = await registerAction(formData)

    if (result.success) {
      // Handle redirect on the client side
      if (result.redirectTo) {
        router.push(result.redirectTo)
      } else {
        // Fallback to login page if no redirect specified
        router.push("/login?registered=true")
      }
    } else {
      setError(result.error || "Registration failed")
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Full Name"
          className="w-full border-t-0 border-x-0 border-b border-gray-400 rounded-none px-0 focus:ring-0 bg-transparent placeholder:text-gray-600 text-gray-800"
          style={{ boxShadow: "none", outline: "none" }}
        />
      </div>
      <div>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full border-t-0 border-x-0 border-b border-gray-400 rounded-none px-0 focus:ring-0 bg-transparent placeholder:text-gray-600 text-gray-800"
          style={{ boxShadow: "none", outline: "none" }}
        />
      </div>
      <div>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="Phone Number"
          className="w-full border-t-0 border-x-0 border-b border-gray-400 rounded-none px-0 focus:ring-0 bg-transparent placeholder:text-gray-600 text-gray-800"
          style={{ boxShadow: "none", outline: "none" }}
        />
      </div>
      <div>
        <Select value={role} onValueChange={setRole} required>
          <SelectTrigger className="w-full border-t-0 border-x-0 border-b border-gray-400 rounded-none px-0 focus:ring-0 bg-transparent text-gray-800">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="department_admin">Department Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {role === "department_admin" && (
        <div>
          <Select value={department} onValueChange={setDepartment} required>
            <SelectTrigger className="w-full border-t-0 border-x-0 border-b border-gray-400 rounded-none px-0 focus:ring-0 bg-transparent text-gray-800">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full border-t-0 border-x-0 border-b border-gray-400 rounded-none px-0 focus:ring-0 bg-transparent placeholder:text-gray-600 text-gray-800"
          style={{ boxShadow: "none", outline: "none" }}
        />
      </div>
      <div>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          placeholder="Confirm Password"
          className="w-full border-t-0 border-x-0 border-b border-gray-400 rounded-none px-0 focus:ring-0 bg-transparent placeholder:text-gray-600 text-gray-800"
          style={{ boxShadow: "none", outline: "none" }}
        />
      </div>

      {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}

      <Button
        type="submit"
        className="w-full bg-[#3a2e5c] hover:bg-[#2a1e4c] text-white py-6 shadow-lg"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full border border-gray-400 bg-white/50 backdrop-blur-sm flex items-center justify-center gap-2 py-6 hover:bg-white/70"
        disabled={loading}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Sign up with Google
      </Button>

      <div className="text-center">
        <span className="text-gray-700">Already have an account? </span>
        <Link href="/login" className="text-[#3a2e5c] font-medium hover:underline">
          Log in
        </Link>
      </div>
    </form>
  )
}
