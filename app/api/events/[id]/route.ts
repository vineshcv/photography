import { NextRequest, NextResponse } from "next/server"

// Mock database (needs to match the one in events/route.ts ideally, but for mock purposes we can duplicate or just return static data if id matches)
// In a real app this would be a DB call.
// For this mock, I'll just return the static data if it matches, or a generic one.

const mockEvents = [
  { 
    id: "evt1", 
    title: "Rama Wedding", 
    date: "2025-12-05", 
    clientName: "Rama & Priya", 
    location: "Grand Palace Hotel",
    coverUrl: "/placeholder.svg?key=evt1" 
  },
  { 
    id: "evt2", 
    title: "Corporate Summit 2025", 
    date: "2025-11-20", 
    clientName: "TechCorp Inc.", 
    location: "Convention Center",
    coverUrl: "/placeholder.svg?key=evt2" 
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const event = mockEvents.find(e => e.id === id)
  
  if (event) {
    return NextResponse.json(event)
  }

  // If not found in static list, return a generic one for newly created events (since we can't share state easily between route handlers in serverless without a DB)
  // In a real app, this would query the DB.
  return NextResponse.json({
    id: id,
    title: "New Event",
    date: new Date().toISOString().split('T')[0],
    clientName: "Client Name",
    location: "Location",
    coverUrl: "/placeholder.svg?key=new"
  })
}
