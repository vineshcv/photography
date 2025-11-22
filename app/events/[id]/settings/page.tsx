"use client"

import { useEffect, useState } from "react"
import { useParams } from 'next/navigation'
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, SettingsIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-radix"

export default function SettingsPage() {
  const params = useParams()
  const eventId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    faceRecognitionThreshold: 50,
    maxUploadSize: 100,
    autoProcessFaces: true,
    faceDetectionSensitivity: "medium" as "low" | "medium" | "high",
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await api.events.getSettings(eventId)
        setSettings(data)
      } catch (error) {
        console.error("Failed to load settings", error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [eventId])

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.events.updateSettings(eventId, settings)
      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Failed to save settings", error)
      alert("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-serif font-medium">Event Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure face recognition and upload preferences
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Face Recognition</CardTitle>
            <CardDescription>
              Control how faces are detected and grouped during photo uploads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="threshold">
                Face Recognition Threshold
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="threshold"
                  type="number"
                  min="1"
                  max="200"
                  value={settings.faceRecognitionThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      faceRecognitionThreshold: parseInt(e.target.value) || 50,
                    })
                  }
                  className="max-w-[200px]"
                />
                <span className="text-sm text-muted-foreground">times</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A face must be detected this many times before it is added to the People list. 
                Higher values reduce false positives but may miss some people.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sensitivity">
                Face Detection Sensitivity
              </Label>
              <Select
                value={settings.faceDetectionSensitivity}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setSettings({ ...settings, faceDetectionSensitivity: value })
                }
              >
                <SelectTrigger className="max-w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Faster)</SelectItem>
                  <SelectItem value="medium">Medium (Balanced)</SelectItem>
                  <SelectItem value="high">High (More Accurate)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Higher sensitivity detects more faces but takes longer to process
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload Settings</CardTitle>
            <CardDescription>
              Configure upload limits and processing options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="maxSize">
                Maximum File Upload Size
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="maxSize"
                  type="number"
                  min="10"
                  max="500"
                  value={settings.maxUploadSize}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxUploadSize: parseInt(e.target.value) || 100,
                    })
                  }
                  className="max-w-[200px]"
                />
                <span className="text-sm text-muted-foreground">MB per file</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Maximum size for individual photo uploads. Larger files will be rejected.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="autoProcess"
                checked={settings.autoProcessFaces}
                onChange={(e) =>
                  setSettings({ ...settings, autoProcessFaces: e.target.checked })
                }
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="autoProcess" className="cursor-pointer">
                  Auto-process faces on upload
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically detect and group faces when photos are uploaded. 
                  Disable to manually trigger face recognition later.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
