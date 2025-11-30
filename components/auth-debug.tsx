"use client"

import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export function AuthDebug() {
  const { userId, isAuthenticated, login, logout } = useAuth()
  const [inputUserId, setInputUserId] = useState("")

  const handleLogin = () => {
    if (inputUserId.trim()) {
      login(inputUserId.trim())
      setInputUserId("")
    }
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-white shadow-lg border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">🔐 Auth Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs">
          <div>Status: {isAuthenticated ? "✅ Logged In" : "❌ Not Logged In"}</div>
          <div>User ID: {userId || "None"}</div>
        </div>

        {!isAuthenticated && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter User ID (e.g., 456)"
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
              className="w-full px-2 py-1 text-xs border rounded"
            />
            <Button onClick={handleLogin} size="sm" className="w-full text-xs">
              Login
            </Button>
          </div>
        )}

        {isAuthenticated && (
          <Button onClick={logout} size="sm" variant="outline" className="w-full text-xs">
            Logout
          </Button>
        )}

        <div className="text-xs text-gray-500">Or visit: /?id=456</div>
      </CardContent>
    </Card>
  )
}
