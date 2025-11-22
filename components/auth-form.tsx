"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"
import { setAuth } from "@/lib/auth"

interface AuthFormProps {
  mode: "login" | "register"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    userType: "freelancer" as "freelancer" | "studio",
    phone: "",
    businessName: "",
    location: "",
    experience: "",
    website: "",
    bio: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === "register") {
        const response = await api.auth.register(formData)
        setAuth(response.token, response.user)
        router.push("/dashboard")
      } else {
        const response = await api.auth.login({
          email: formData.email,
          password: formData.password,
        })
        setAuth(response.token, response.user)
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>I am a</Label>
            <RadioGroup
              value={formData.userType}
              onValueChange={(value) => setFormData({ ...formData, userType: value as "freelancer" | "studio" })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="freelancer" id="freelancer" />
                <Label htmlFor="freelancer" className="font-normal cursor-pointer">
                  Freelancer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="studio" id="studio" />
                <Label htmlFor="studio" className="font-normal cursor-pointer">
                  Studio
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.userType === "studio" && (
            <div className="space-y-2">
              <Label htmlFor="businessName">Business/Studio Name</Label>
              <Input
                id="businessName"
                type="text"
                placeholder="My Photography Studio"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required={formData.userType === "studio"}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location/City</Label>
            <Input
              id="location"
              type="text"
              placeholder="Kochi, Kerala"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              placeholder="5"
              min="0"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website/Portfolio (Optional)</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://yourportfolio.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About You (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about your photography style and experience..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
            />
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Account Information</h3>
            <p className="text-xs text-muted-foreground">Create your login credentials</p>
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Loading..." : mode === "login" ? "Log In" : "Create Account"}
      </Button>
    </form>
  )
}
