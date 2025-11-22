import { NextRequest, NextResponse } from "next/server"

// Mock database
let events = [
  { 
    id: "evt1", 
    title: "Rama Wedding", 
    date: "2025-12-05", 
    clientName: "Rama & Priya", 
    location: "Grand Palace Hotel",
    coverUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
    imageCount: 1240,
    totalSize: "8.4 GB"
  },
  { 
    id: "evt2", 
    title: "Corporate Summit 2025", 
    date: "2025-11-20", 
    clientName: "TechCorp Inc.", 
    location: "Convention Center",
    coverUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    imageCount: 450,
    totalSize: "3.2 GB"
  }
]

export async function GET() {
  return NextResponse.json(events)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newEvent = {
      id: `evt_${Date.now()}`,
      ...body,
      coverUrl: "/placeholder.svg?key=new-event",
      imageCount: 0,
      totalSize: "0 MB"
    }
    events = [newEvent, ...events]
    return NextResponse.json(newEvent)
  } catch (error) {
    return NextResponse.json({ message: "Failed to create event" }, { status: 500 })
  }
}
