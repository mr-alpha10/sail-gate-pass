"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createApplicationAction } from "./actions"

interface ApplicationFormProps {
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  onClose: () => void
}

export default function ApplicationForm({ userId, userName, userEmail, userPhone, onClose }: ApplicationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    try {
      // Add the user data to form data
      formData.append("userId", userId)
      formData.append("userName", userName)
      formData.append("userEmail", userEmail)
      formData.append("userPhone", userPhone)

      const result = await createApplicationAction(formData)

      if (result.success) {
        onClose()
        // Refresh the page to show new application
        router.refresh()
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      setError("Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Gate Pass Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purpose">Purpose of Visit</Label>
              <Textarea id="purpose" name="purpose" required placeholder="Describe the purpose of your visit" />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select name="department" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
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
          </div>
          

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visitDate">Visit Date</Label>
              <Input
                id="visitDate"
                name="visitDate"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="visitTime">Visit Time</Label>
              <Input id="visitTime" name="visitTime" type="time" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Select name="duration" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 hour">1 hour</SelectItem>
                  <SelectItem value="2 hours">2 hours</SelectItem>
                  <SelectItem value="Half day">Half day</SelectItem>
                  <SelectItem value="Full day">Full day</SelectItem>
                  <SelectItem value="Multiple days">Multiple days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="vehicleNumber">Vehicle Number (Optional)</Label>
              <Input id="vehicleNumber" name="vehicleNumber" placeholder="Enter vehicle number if applicable" />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
