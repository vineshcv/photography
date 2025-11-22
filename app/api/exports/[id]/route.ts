import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Mock export status check
  const { id } = await params
  return NextResponse.json({
    id: id,
    status: "completed",
    downloadUrl: "#"
  })
}
