import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // Using local Kerala wedding photos from /public/kerala-wedding-photos/photos/
  // In a real app, this would query the DB for photos associated with the event
  
  // Photo files in the photos folder: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
  const photoNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  
  const photos = photoNumbers.map((num, i) => ({
    id: `photo_${i + 1}`,
    url: `/kerala-wedding-photos/photos/${num}`,
    thumbnail: `/kerala-wedding-photos/photos/${num}`,
    filename: `kerala-wedding-${num}.jpg`,
    width: 800,
    height: 600
  }))

  return NextResponse.json(photos)
}
