"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { TemplateList } from "@/components/template-list"
import { MyWorkList } from "@/components/my-work-list"
import { api } from "@/lib/api"
import { Loader2, Plus, Layout, Palette, FolderOpen } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function TemplatesPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [templates, setTemplates] = useState<any[]>([])
  const [myWork, setMyWork] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'browse' | 'my-work'>('browse')

  useEffect(() => {
    const loadData = async () => {
      try {
        const { id } = await params
        const [templatesData, myWorkData] = await Promise.all([
          api.events.getTemplates(id),
          api.events.getMyWork(id)
        ])
        setTemplates(templatesData)
        setMyWork(myWorkData)
      } catch (error) {
        console.error("Failed to load data", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [params])

  const handleCreateTemplate = async () => {
    try {
      const { id } = await params
      const newTemplate = await api.events.createTemplate(id, {
        name: "New Template",
        json_spec: {}
      })
      router.push(`/events/${id}/templates/${newTemplate.id}/editor`)
    } catch (error) {
      console.error("Failed to create template", error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground mt-2">
            Browse professional templates or continue working on your projects
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center">
        <div className="flex items-center bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('browse')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === 'browse'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Palette className="h-4 w-4" />
            Browse Templates
          </button>
          <button
            onClick={() => setActiveTab('my-work')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === 'my-work'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FolderOpen className="h-4 w-4" />
            My Work
            {myWork.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                {myWork.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'browse' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <Button onClick={handleCreateTemplate} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create from Scratch
            </Button>
          </div>

          {templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Layout className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No templates available</h3>
              <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
                Templates will appear here when they become available.
              </p>
            </div>
          ) : (
            <TemplateList eventId={React.use(params).id} templates={templates} />
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <Button onClick={handleCreateTemplate} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create New Project
            </Button>
          </div>

          {myWork.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed">
              <div className="rounded-full bg-muted p-4 mb-4">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No projects yet</h3>
              <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
                When you use a template or create a new project, it will appear here for you to continue working on.
              </p>
              <Button onClick={() => setActiveTab('browse')} variant="outline">
                Browse Templates
              </Button>
            </div>
          ) : (
            <MyWorkList eventId={React.use(params).id} projects={myWork} />
          )}
        </div>
      )}
    </div>
  )
}
