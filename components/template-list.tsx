import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TemplatePreviewModal } from "@/components/template-preview-modal"
import { api } from "@/lib/api"
import { Edit, Trash2, Eye, Layout } from 'lucide-react'

interface Template {
  id: string
  name: string
  description?: string
  category?: string
  thumbnail: string
  updatedAt: string
  pages?: any[]
}

interface TemplateListProps {
  eventId: string
  templates: Template[]
}

export function TemplateList({ eventId, templates }: TemplateListProps) {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template)
    setIsPreviewOpen(true)
  }

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
    setPreviewTemplate(null)
  }

  const handleUseTemplate = async (templateId: string) => {
    try {
      // Find the template to get its details
      const template = templates.find(t => t.id === templateId)
      
      // Create a new work item when using a template
      await api.events.createWorkItem(eventId, {
        name: `${template?.name || 'Template'} Project`,
        description: `Based on ${template?.name || 'template'}`,
        templateId: templateId,
        templateName: template?.name || 'Template',
        thumbnail: template?.thumbnail || '/placeholder.svg',
        pageCount: template?.pages?.length || 1
      })
      
      // Navigate to editor
      window.location.href = `/events/${eventId}/templates/${templateId}/editor`
    } catch (error) {
      console.error('Failed to create work item:', error)
      // Still navigate to editor even if tracking fails
      window.location.href = `/events/${eventId}/templates/${templateId}/editor`
    }
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map((template) => (
        <Card key={template.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50">
          <div className="relative aspect-[4/3] bg-muted">
            <Image
              src={template.thumbnail || "/placeholder.svg?key=template"}
              alt={template.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {template.category && (
              <Badge 
                variant="secondary" 
                className="absolute top-2 left-2 text-xs bg-black/70 text-white border-none"
              >
                {template.category}
              </Badge>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/90 hover:bg-white"
                onClick={() => handlePreview(template)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Link href={`/events/${eventId}/templates/${template.id}/editor`}>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Edit className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              </Link>
            </div>
          </div>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                  {template.name}
                </h3>
                {template.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {template.description}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Layout className="h-3 w-3" />
              <span>{template.pages?.length || 1} pages</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3 w-3" />
            </Button>
          </CardFooter>
        </Card>
        ))}
      </div>

      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        onUseTemplate={handleUseTemplate}
      />
    </>
  )
}
