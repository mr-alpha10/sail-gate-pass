"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, ArrowLeft, RefreshCw, CheckCircle, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { verifyOTPAction, resendOTPAction } from "./actions"

interface VerifyEmailClientProps {
  email: string
}

export default function VerifyEmailClient({ email }: VerifyEmailClientProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1)
    }

    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits are entered
    if (value && index === 5) {
      const fullOtp = newOtp.join("")
      if (fullOtp.length === 6) {
        handleVerify(fullOtp)
      }
    }
  }

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
      handleVerify(pastedData)
    }
  }

  // Verify OTP
  const handleVerify = async (otpValue?: string) => {
    const otpToVerify = otpValue || otp.join("")
    
    if (otpToVerify.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setLoading(true)
    setError("")

    const result = await verifyOTPAction(email, otpToVerify)

    if (result.success) {
      setSuccess("Email verified successfully! Redirecting...")
      setTimeout(() => {
        router.push("/complete-profile")
      }, 1500)
    } else {
      setError(result.error || "Verification failed")
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }

    setLoading(false)
  }

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return

    setResendLoading(true)
    setError("")

    const result = await resendOTPAction(email)

    if (result.success) {
      setSuccess("New OTP sent! Check your email (and console for demo).")
      setResendCooldown(60) // 60 second cooldown
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
      setTimeout(() => setSuccess(""), 5000)
    } else {
      setError(result.error || "Failed to resend OTP")
    }

    setResendLoading(false)
  }

  // Mask email for display
  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Register */}
        <Link 
          href="/register" 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Register
        </Link>

        <Card className="backdrop-blur-lg bg-white/80 border border-white/30 shadow-2xl">
          <CardHeader className="text-center pb-2">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-full">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <CardTitle className="text-2xl font-bold text-gray-800">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              We've sent a 6-digit verification code to
              <br />
              <span className="font-semibold text-gray-800">{maskedEmail}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={loading || !!success}
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg
                    ${error ? "border-red-400 bg-red-50" : "border-gray-300"}
                    ${digit ? "border-blue-500 bg-blue-50" : ""}
                    focus:border-blue-600 focus:ring-2 focus:ring-blue-200
                    disabled:opacity-50 transition-all`}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg border border-green-200 flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            )}

            {/* Verify Button */}
            <Button
              onClick={() => handleVerify()}
              disabled={loading || otp.join("").length !== 6 || !!success}
              className="w-full bg-[#3a2e5c] hover:bg-[#2a1e4c] text-white py-6 text-lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Verified!
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Verify Email
                </>
              )}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
              <Button
                variant="ghost"
                onClick={handleResend}
                disabled={resendLoading || resendCooldown > 0 || !!success}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              >
                {resendLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>

            {/* Demo Notice */}
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800 mb-1">📧 Demo Mode</p>
              <p className="text-xs text-yellow-700">
                Since this is a demo, the OTP is printed in the <strong>terminal/console</strong> where you ran <code>npm run dev</code>. 
                Check there for your 6-digit code!
              </p>
            </div>

            {/* Security Note */}
            <div className="text-center text-xs text-gray-500">
              <p>This code expires in 10 minutes.</p>
              <p className="mt-1">For security, don't share this code with anyone.</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 SAIL Gate Pass System</p>
        </div>
      </div>
    </div>
  )
}
