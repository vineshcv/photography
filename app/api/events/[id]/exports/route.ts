import { NextRequest, NextResponse } from "next/server"

let exports: any[] = []

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return NextResponse.json(exports)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const newExport = {
      id: `exp_${Date.now()}`,
      eventId: id,
      type: body.type,
      status: "processing",
      createdAt: new Date().toISOString(),
      size: null,
      count: 145, // Mock count
      downloadUrl: null
    }
    
    exports = [newExport, ...exports]
    
    // Simulate processing
    setTimeout(() => {
      const index = exports.findIndex(e => e.id === newExport.id)
      if (index !== -1) {
        exports[index] = {
          ...exports[index],
          status: "completed",
          size: "1.2 GB",
          downloadUrl: "#"
        }
      }
    }, 3000)

    return NextResponse.json(newExport)
  } catch (error) {
    return NextResponse.json({ message: "Failed to create export" }, { status: 500 })
  }
}
