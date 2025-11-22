import { NextRequest, NextResponse } from "next/server"

// Mock share history storage (in real app, this would come from database)
// Note: In production, shares would be fetched from the share API or shared database
let shareHistoryStorage: any[] = []

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params
  
  // In a real app, fetch from share API or shared database
  // For now, use the storage array
  const eventShares = shareHistoryStorage.filter(share => share.eventId === eventId)
  
  // Combine with mock history data
  const history = [
    {
      id: "1",
      type: "photos",
      details: "Shared photos with client@example.com",
      link: "https://app.versal.com/share/abc-123",
      email: "client@example.com",
      method: "email",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days left
      status: "active",
      views: 12,
    },
    {
      id: "2",
      type: "project",
      details: "Wedding Album - Sarah & John shared via WhatsApp",
      link: "https://app.versal.com/share/xyz-789",
      email: null,
      method: "whatsapp",
      projectName: "Wedding Album - Sarah & John",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days left
      status: "active",
      views: 45,
    },
    ...eventShares.map(share => ({
      id: share.id,
      type: share.type || "photos",
      details: share.email 
        ? `Shared ${share.type === 'project' ? share.projectName : 'photos'} with ${share.email}`
        : `Shared ${share.type === 'project' ? share.projectName : 'photos'}`,
      link: share.link,
      email: share.email || null,
      method: share.method || "email",
      projectName: share.projectName || null,
      createdAt: share.createdAt,
      expiresAt: share.expiresAt || new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      status: share.status || "active",
      views: share.views || 0,
    }))
  ]

  // Sort by creation date (newest first)
  history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json(history)
}
