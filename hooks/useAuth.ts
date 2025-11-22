"use client"

import { useState, useEffect } from "react"
import { getUser, getToken, clearAuth, type User } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    const userData = getUser()
    
    setUser(userData)
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  const logout = () => {
    clearAuth()
    setUser(null)
    setIsAuthenticated(false)
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    logout
  }
}




