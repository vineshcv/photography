import { NextRequest, NextResponse } from "next/server"

// Mock storage for user's work/projects
let myWorkStorage: Record<string, any[]> = {}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params

  // Get existing work for this event
  const existingWork = myWorkStorage[eventId] || []

  // Mock data - in a real app, this would come from a database
  const mockWork = [
    {
      id: "work_1",
      name: "Wedding Album - Sarah & John",
      description: "Romantic wedding album with ceremony and reception photos",
      status: "in-progress",
      thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      templateId: "tpl_wedding_classic",
      templateName: "Classic Wedding Album",
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      pageCount: 12
    },
    {
      id: "work_2", 
      name: "Birthday Party Memories",
      description: "Fun birthday celebration with family and friends",
      status: "draft",
      thumbnail: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop",
      templateId: "tpl_birthday_fun",
      templateName: "Birthday Celebration",
      lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      pageCount: 8
    }
  ]

  // Combine existing work with mock data (in a real app, you'd only return user's actual work)
  const allWork = [...existingWork, ...mockWork]

  return NextResponse.json(allWork)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params
  const body = await request.json()

  // Create new work item
  const newWork = {
    id: `work_${Date.now()}`,
    name: body.name || "Untitled Project",
    description: body.description || "",
    status: "draft",
    thumbnail: body.thumbnail || "/placeholder.svg?key=new-work",
    templateId: body.templateId,
    templateName: body.templateName || "Custom Template",
    lastModified: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    pageCount: body.pageCount || 1
  }

  // Store the new work
  if (!myWorkStorage[eventId]) {
    myWorkStorage[eventId] = []
  }
  myWorkStorage[eventId].unshift(newWork)

  return NextResponse.json(newWork)
}




