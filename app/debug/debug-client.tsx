"use client"

import { Button } from "@/components/ui/button"

export default function DebugClient() {
  const handleRefresh = () => {
    console.log("🔄 Refreshing page...")
    window.location.reload()
  }

  return (
    <div className="space-x-2">
      <Button asChild variant="outline">
        <a href="/login">Back to Login</a>
      </Button>
      <Button onClick={handleRefresh}>Refresh</Button>
    </div>
  )
}
