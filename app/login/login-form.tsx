"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginAction } from "./actions"
import Link from "next/link"

export default function LoginForm() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const message = searchParams.get("message")
    if (message) {
      setSuccessMessage(message)
      // Clear the message from URL after showing it
      setTimeout(() => {
        setSuccessMessage("")
        router.replace("/login")
      }, 5000)
    }
  }, [searchParams, router])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    const result = await loginAction(formData)

    if (result.success) {
      // Check if needs verification or profile completion
      if (result.redirectTo) {
        router.push(result.redirectTo)
        return
      }
      
      // Normal login - redirect based on role
      if (result.role === "user") {
        router.push("/dashboard")
      } else if (result.role === "security") {
        router.push("/security")
      } else if (result.role === "department_admin") {
        router.push("/department")
      }
    } else {
      setError(result.error || "Login failed")
    }

    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
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
          id="password"
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full border-t-0 border-x-0 border-b border-gray-400 rounded-none px-0 focus:ring-0 bg-transparent placeholder:text-gray-600 text-gray-800"
          style={{ boxShadow: "none", outline: "none" }}
        />
      </div>

      {successMessage && (
        <div className="text-green-600 text-sm bg-green-50 p-3 rounded border border-green-200">{successMessage}</div>
      )}

      {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}

      <Button
        type="submit"
        className="w-full bg-[#3a2e5c] hover:bg-[#2a1e4c] text-white py-6 shadow-lg"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      {/* Forgot Password Button */}
      <div className="text-center">
        <Link
          href="/forgot-password"
          className="inline-block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-md font-medium transition-colors border border-gray-300"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="mt-6 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/30">
        <p className="text-sm font-medium text-gray-700 mb-3">Demo credentials:</p>
        <div className="space-y-1 text-xs text-gray-600">
          <p>
            <strong>User:</strong> user@example.com / password123
          </p>
          <p>
            <strong>Security:</strong> security@company.com / password123
          </p>
          <p>
            <strong>HR Admin:</strong> hr@company.com / password123
          </p>
          <p>
            <strong>IT Admin:</strong> it@company.com / password123
          </p>
        </div>
      </div>
      <div className="text-center mt-4">
        <span className="text-gray-700">Don't have an account? </span>
        <Link href="/register" className="text-[#3a2e5c] font-medium hover:underline">
          Create Account
        </Link>
      </div>
    </form>
  )
}
