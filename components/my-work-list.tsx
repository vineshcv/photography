"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProjectShareDialog } from "@/components/project-share-dialog"
import { Edit, Trash2, Eye, Clock, FileText, Share2 } from 'lucide-react'
import { formatDistanceToNow } from "date-fns"

interface Project {
  id: string
  name: string
  description?: string
  status: 'draft' | 'in-progress' | 'completed'
  thumbnail: string
  templateId: string
  templateName: string
  lastModified: string
  createdAt: string
  pageCount?: number
}

interface MyWorkListProps {
  eventId: string
  projects: Project[]
}

export function MyWorkList({ eventId, projects }: MyWorkListProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleShare = (project: Project) => {
    setSelectedProject(project)
    setShareDialogOpen(true)
  }

  const handleCloseShare = () => {
    setShareDialogOpen(false)
    setSelectedProject(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in-progress':
        return 'In Progress'
      case 'draft':
        return 'Draft'
      default:
        return 'Draft'
    }
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
        <Card key={project.id} className="group hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="p-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
              <Image
                src={project.thumbnail}
                alt={project.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Link href={`/events/${eventId}/templates/${project.id}/editor`}>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Edit className="mr-2 h-4 w-4" />
                    Continue Editing
                  </Button>
                </Link>
              </div>
              <div className="absolute top-3 right-3">
                <Badge 
                  variant="secondary" 
                  className={`${getStatusColor(project.status)} text-xs`}
                >
                  {getStatusText(project.status)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                  {project.name}
                </h3>
              </div>
              
              {project.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span>Based on {project.templateName}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Modified {formatDistanceToNow(new Date(project.lastModified))} ago</span>
              </div>
              
              {project.pageCount && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{project.pageCount} pages</span>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <div className="flex items-center gap-2 w-full">
              <Link href={`/events/${eventId}/templates/${project.id}/editor`} className="flex-1">
                <Button size="sm" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Continue
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleShare(project)}
                title="Share project"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" title="Preview">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" title="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
        ))}
      </div>

      <ProjectShareDialog
        project={selectedProject ? {
          id: selectedProject.id,
          name: selectedProject.name,
          eventId: eventId
        } : null}
        isOpen={shareDialogOpen}
        onClose={handleCloseShare}
      />
    </>
  )
}
