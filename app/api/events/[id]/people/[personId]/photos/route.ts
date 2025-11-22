import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; personId: string }> }
) {
  // Mock photos for a specific person
  // In a real app, this would query the DB for photos containing this person
  
  const { id, personId } = await params
  const count = personId === 'p1' ? 12 : 8
  
  const photoSets: Record<string, string[]> = {
    p1: [
      "photo-1534528741775-53994a69daeb",
      "photo-1529626455594-4ff0802cfb7e", 
      "photo-1519741497674-611481863552",
      "photo-1583939003579-730e3918a45a",
      "photo-1606800052052-a08af7148866",
      "photo-1511285560929-80b456fea0bc",
      "photo-1525772764200-be829a350797",
      "photo-1591604466107-ec97de577aff",
      "photo-1469371670807-013ccf25f16a",
      "photo-1464047736614-af63643285bf",
      "photo-1522673607200-164d1b6ce486",
      "photo-1520854221256-17451cc331bf",
    ],
    default: [
      "photo-1511285560929-80b456fea0bc",
      "photo-1464047736614-af63643285bf",
      "photo-1522673607200-164d1b6ce486",
      "photo-1520854221256-17451cc331bf",
      "photo-1525772764200-be829a350797",
      "photo-1591604466107-ec97de577aff",
      "photo-1469371670807-013ccf25f16a",
      "photo-1529634806980-85c3dd6d34ac",
    ]
  }
  
  const photoIds = photoSets[personId] || photoSets.default
  
  const photos = photoIds.slice(0, count).map((photoId, i) => ({
    id: `photo_${personId}_${i}`,
    url: `https://images.unsplash.com/${photoId}?w=800&h=600&fit=crop`,
    filename: `IMG_${2000 + i}.jpg`,
    width: 800,
    height: 600
  }))

  return NextResponse.json(photos)
}
