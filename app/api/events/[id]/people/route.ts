import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // Using local Kerala wedding face images from /public/kerala-wedding-photos/faces/
  // Face files in the faces folder: 1, 2, 3, 4, 5, 6, 7
  
  const people = [
    { personId: "p1", name: "Priya", thumbnail: "/kerala-wedding-photos/faces/1", count: 120, confidence: 0.98 },
    { personId: "p2", name: "Rama", thumbnail: "/kerala-wedding-photos/faces/2", count: 130, confidence: 0.97 },
    { personId: "p3", name: "Aunty", thumbnail: "/kerala-wedding-photos/faces/3", count: 45, confidence: 0.9 },
    { personId: "p4", name: "Uncle", thumbnail: "/kerala-wedding-photos/faces/4", count: 32, confidence: 0.85 },
    { personId: "p5", name: "Guest 1", thumbnail: "/kerala-wedding-photos/faces/5", count: 12, confidence: 0.8 },
    { personId: "p6", name: "Guest 2", thumbnail: "/kerala-wedding-photos/faces/6", count: 8, confidence: 0.75 },
  ]

  return NextResponse.json(people)
}
