import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params

    // In a real app, this would fetch from database
    // For now, return mock data with default values
    
    // Mock event progress - in real app, fetch from database
    // Steps: 1 = thumbnails created, 2 = link shared, 3 = customer submitted, 4 = uploaded to s3, 5 = work in progress
    const mockProgress = {
      currentStep: 1, // Default to step 1
      customerName: null as string | null,
      submittedAt: null as string | null,
      linkSharedAt: null as string | null,
      thumbnailsCreatedAt: null as string | null,
      uploadedToCloudAt: null as string | null,
      workInProgressAt: null as string | null
    }

    // In a real app, you would fetch this from your database
    // Example query:
    // const event = await db.events.findUnique({ where: { id: eventId }, include: { progress: true, notifications: true } })
    
    return NextResponse.json({
      success: true,
      data: mockProgress
    })
  } catch (error: any) {
    console.error("Failed to get progress:", error)
    return NextResponse.json(
      { error: error.message || "Failed to get progress" },
      { status: 500 }
    )
  }
}

