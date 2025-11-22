import { NextRequest, NextResponse } from "next/server"

// Mock settings storage
const mockSettings: Record<string, any> = {}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params

  // Return default settings if not set
  const settings = mockSettings[eventId] || {
    faceRecognitionThreshold: 50,
    maxUploadSize: 100, // MB
    autoProcessFaces: true,
    faceDetectionSensitivity: "medium",
  }

  return NextResponse.json(settings)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params
  const body = await request.json()

  // Store settings
  mockSettings[eventId] = {
    faceRecognitionThreshold: body.faceRecognitionThreshold || 50,
    maxUploadSize: body.maxUploadSize || 100,
    autoProcessFaces: body.autoProcessFaces !== false,
    faceDetectionSensitivity: body.faceDetectionSensitivity || "medium",
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(mockSettings[eventId])
}
