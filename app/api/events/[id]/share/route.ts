import { NextRequest, NextResponse } from "next/server"

// Mock storage for sharing history
let shareHistory: any[] = []
let shareHistoryStorage: any[] = [] // For history tab

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params
    const body = await request.json()

    const { type, projectId, email, link, projectName } = body

    // In a real app, this would:
    // 1. Generate a secure shareable link with token
    // 2. Send an email to the customer with the link
    // 3. Store the sharing history in the database

    // For now, we'll just store it in memory
    const shareRecord = {
      id: `share_${Date.now()}`,
      eventId,
      type,
      projectId,
      email,
      link,
      projectName,
      method: body.method || "email",
      createdAt: new Date().toISOString(),
      expiresAt: body.expiresAt || new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days default
      status: "sent",
      views: 0
    }

    shareHistory.push(shareRecord)
    shareHistoryStorage.push(shareRecord)

    // In a real app, you would send an email here using a service like:
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Nodemailer
    
    // For demo purposes, we'll return success
    return NextResponse.json({
      success: true,
      message: `Share link sent to ${email}`,
      shareId: shareRecord.id
    })
  } catch (error) {
    console.error("Failed to share:", error)
    return NextResponse.json(
      { success: false, message: "Failed to share project" },
      { status: 500 }
    )
  }
}

// Get share history for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params
  
  // Filter shares for this event
  const eventShares = shareHistory.filter(share => share.eventId === eventId)
  
  return NextResponse.json(eventShares)
}
