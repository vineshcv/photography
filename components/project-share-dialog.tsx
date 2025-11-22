"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Mail, MessageCircle, Copy, Check } from 'lucide-react'
import { toast } from "sonner"

interface ProjectShareDialogProps {
  project: {
    id: string
    name: string
    eventId: string
  } | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectShareDialog({ project, isOpen, onClose }: ProjectShareDialogProps) {
  const [email, setEmail] = useState("")
  const [copied, setCopied] = useState(false)

  if (!isOpen || !project) return null

  // Generate shareable link
  const shareLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/share/project/${project.id}`
    : ''

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    setCopied(true)
    toast.success("Link copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `Hi! I'd like to share this photo album project with you:\n\n${project.name}\n\nView it here: ${shareLink}`
    )
    const whatsappUrl = `https://wa.me/?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const handleEmailShare = () => {
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address")
      return
    }

    const subject = encodeURIComponent(`Photo Album: ${project.name}`)
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to share this photo album project with you:\n\n${project.name}\n\nYou can view it here:\n${shareLink}\n\nBest regards`
    )
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`
    window.location.href = mailtoUrl
    toast.success("Opening email client...")
  }

  const handleSendEmailLink = async () => {
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address")
      return
    }

    try {
      // In a real app, this would send an email via your backend
      const response = await fetch(`/api/events/${project.eventId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'project',
          projectId: project.id,
          email: email,
          link: shareLink,
          projectName: project.name
        })
      })

      if (response.ok) {
        toast.success(`Share link sent to ${email}!`)
        setEmail("")
      } else {
        toast.error("Failed to send email. Please try again.")
      }
    } catch (error) {
      console.error("Failed to send email:", error)
      toast.error("Failed to send email. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-md mx-4 bg-background rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Share Project</h2>
            <p className="text-sm text-muted-foreground mt-1">{project.name}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Share Link Section */}
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="share-link" className="text-sm font-medium mb-2 block">
              Shareable Link
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="share-link"
                value={shareLink}
                readOnly
                className="flex-1 font-mono text-xs"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                title="Copy link"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Share via:</h3>
          
          {/* WhatsApp */}
          <Button
            onClick={handleWhatsAppShare}
            className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Share on WhatsApp
          </Button>

          {/* Email Section */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Send via Email
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleSendEmailLink}
                variant="default"
                size="icon"
                title="Send email link"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Or click to open email client:
            </p>
            <Button
              onClick={handleEmailShare}
              variant="outline"
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Open Email Client
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            The recipient will be able to view this project using the shared link.
          </p>
        </div>
      </div>
    </div>
  )
}




