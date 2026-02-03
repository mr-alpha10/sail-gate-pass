"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  User, Calendar, CreditCard, MapPin, Phone, Camera, 
  Building, Briefcase, CheckCircle, ArrowRight, Upload,
  AlertCircle
} from "lucide-react"
import Image from "next/image"
import { completeProfileAction } from "./actions"

interface CompleteProfileClientProps {
  email: string
}

export default function CompleteProfileClient({ email }: CompleteProfileClientProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Form data
  const [formData, setFormData] = useState({
    // Personal Info
    dateOfBirth: "",
    gender: "",
    
    // Government ID
    governmentIdType: "",
    governmentIdNumber: "",
    
    // Address
    address: "",
    city: "",
    state: "",
    pincode: "",
    
    // Profile Picture
    profilePicture: "",
    
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    
    // Employment (optional)
    employeeId: "",
    designation: "",
    companyName: "",
  })

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Handle input change
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setPreviewImage(base64)
        setFormData((prev) => ({ ...prev, profilePicture: base64 }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Validate current step
  const validateStep = () => {
    switch (currentStep) {
      case 1: // Personal Info
        if (!formData.dateOfBirth) {
          setError("Please enter your date of birth")
          return false
        }
        if (!formData.gender) {
          setError("Please select your gender")
          return false
        }
        return true

      case 2: // Government ID
        if (!formData.governmentIdType) {
          setError("Please select ID type")
          return false
        }
        if (!formData.governmentIdNumber) {
          setError("Please enter your ID number")
          return false
        }
        // Basic validation for ID formats
        if (formData.governmentIdType === "aadhaar" && !/^\d{12}$/.test(formData.governmentIdNumber)) {
          setError("Aadhaar number must be 12 digits")
          return false
        }
        if (formData.governmentIdType === "pan" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.governmentIdNumber.toUpperCase())) {
          setError("Invalid PAN format (e.g., ABCDE1234F)")
          return false
        }
        return true

      case 3: // Address
        if (!formData.address) {
          setError("Please enter your address")
          return false
        }
        if (!formData.city) {
          setError("Please enter your city")
          return false
        }
        if (!formData.state) {
          setError("Please select your state")
          return false
        }
        if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) {
          setError("Please enter a valid 6-digit pincode")
          return false
        }
        return true

      case 4: // Emergency Contact & Photo
        if (!formData.emergencyContactName) {
          setError("Please enter emergency contact name")
          return false
        }
        if (!formData.emergencyContactPhone || !/^\d{10}$/.test(formData.emergencyContactPhone)) {
          setError("Please enter a valid 10-digit phone number")
          return false
        }
        if (!formData.emergencyContactRelation) {
          setError("Please select relationship")
          return false
        }
        return true

      default:
        return true
    }
  }

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
      setError("")
    }
  }

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setError("")
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep()) return

    setLoading(true)
    setError("")

    try {
      const result = await completeProfileAction(email, formData)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Failed to save profile")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Indian states list
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Please provide your details for identity verification</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8 px-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                  ${currentStep >= step 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-500"
                  }`}
              >
                {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
              </div>
              {step < 4 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-2 rounded transition-all
                    ${currentStep > step ? "bg-blue-600" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between text-xs text-gray-500 mb-6 px-2">
          <span className={currentStep === 1 ? "text-blue-600 font-medium" : ""}>Personal</span>
          <span className={currentStep === 2 ? "text-blue-600 font-medium" : ""}>Government ID</span>
          <span className={currentStep === 3 ? "text-blue-600 font-medium" : ""}>Address</span>
          <span className={currentStep === 4 ? "text-blue-600 font-medium" : ""}>Emergency</span>
        </div>

        {/* Form Card */}
        <Card className="backdrop-blur-lg bg-white/90 border border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <><Calendar className="h-5 w-5 text-blue-600" /> Personal Information</>}
              {currentStep === 2 && <><CreditCard className="h-5 w-5 text-blue-600" /> Government ID</>}
              {currentStep === 3 && <><MapPin className="h-5 w-5 text-blue-600" /> Address Details</>}
              {currentStep === 4 && <><Phone className="h-5 w-5 text-blue-600" /> Emergency Contact & Photo</>}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Enter your personal details"}
              {currentStep === 2 && "Provide government-issued ID for verification"}
              {currentStep === 3 && "Enter your current residential address"}
              {currentStep === 4 && "Add emergency contact and profile photo"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleChange("gender", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Optional: Employment Details */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Employment Details (Optional)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Company/Organization</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleChange("companyName", e.target.value)}
                        placeholder="e.g., SAIL"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => handleChange("employeeId", e.target.value)}
                        placeholder="e.g., EMP001"
                        className="mt-1"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        value={formData.designation}
                        onChange={(e) => handleChange("designation", e.target.value)}
                        placeholder="e.g., Software Engineer"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Government ID */}
            {currentStep === 2 && (
              <>
                <div>
                  <Label htmlFor="governmentIdType">ID Type *</Label>
                  <Select
                    value={formData.governmentIdType}
                    onValueChange={(value) => handleChange("governmentIdType", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                      <SelectItem value="pan">PAN Card</SelectItem>
                      <SelectItem value="voter_id">Voter ID</SelectItem>
                      <SelectItem value="driving_license">Driving License</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="governmentIdNumber">
                    {formData.governmentIdType === "aadhaar" ? "Aadhaar Number (12 digits)" :
                     formData.governmentIdType === "pan" ? "PAN Number (e.g., ABCDE1234F)" :
                     "ID Number"} *
                  </Label>
                  <Input
                    id="governmentIdNumber"
                    value={formData.governmentIdNumber}
                    onChange={(e) => handleChange("governmentIdNumber", e.target.value.toUpperCase())}
                    placeholder={
                      formData.governmentIdType === "aadhaar" ? "XXXX XXXX XXXX" :
                      formData.governmentIdType === "pan" ? "ABCDE1234F" :
                      "Enter your ID number"
                    }
                    className="mt-1"
                    maxLength={formData.governmentIdType === "aadhaar" ? 12 : 
                              formData.governmentIdType === "pan" ? 10 : 20}
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    Your ID information is securely stored and used only for verification purposes.
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Address */}
            {currentStep === 3 && (
              <>
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="House/Flat No., Street, Locality"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="e.g., Ranchi"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleChange("pincode", e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g., 834002"
                      className="mt-1"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleChange("state", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 4: Emergency Contact & Photo */}
            {currentStep === 4 && (
              <>
                {/* Profile Picture */}
                <div>
                  <Label>Profile Picture (Optional)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div 
                      className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {previewImage ? (
                        <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="mb-2"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-xs text-gray-500">JPG, PNG. Max 5MB.</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-700 mb-3">Emergency Contact *</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="emergencyContactName">Contact Name *</Label>
                      <Input
                        id="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={(e) => handleChange("emergencyContactName", e.target.value)}
                        placeholder="e.g., John Doe"
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergencyContactPhone">Phone Number *</Label>
                        <Input
                          id="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={(e) => handleChange("emergencyContactPhone", e.target.value.replace(/\D/g, ""))}
                          placeholder="10-digit number"
                          className="mt-1"
                          maxLength={10}
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyContactRelation">Relationship *</Label>
                        <Select
                          value={formData.emergencyContactRelation}
                          onValueChange={(value) => handleChange("emergencyContactRelation", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select relation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="sibling">Sibling</SelectItem>
                            <SelectItem value="child">Child</SelectItem>
                            <SelectItem value="friend">Friend</SelectItem>
                            <SelectItem value="colleague">Colleague</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || loading}
              >
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Registration
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Your information is secure and encrypted.</p>
          <p className="mt-1">© 2024 SAIL Gate Pass System</p>
        </div>
      </div>
    </div>
  )
}
