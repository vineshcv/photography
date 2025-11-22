import { NextRequest, NextResponse } from "next/server"

// We need to access the same templates array. In a real app, this would be a DB.
// For this mock, we'll duplicate the default templates logic or just return a mock based on ID.
// To keep it simple and consistent with the list endpoint, we'll redefine the defaults here.

const DEFAULT_TEMPLATES = [
  {
    id: "tpl_wedding_classic",
    name: "Classic Wedding Album",
    thumbnail: "/kerala-wedding-photos/templates/1",
    config: {
      rows: 2,
      cols: 2,
      gap: 24,
      padding: 48
    },
    updatedAt: new Date().toISOString()
  },
  {
    id: "tpl_minimal_grid",
    name: "Minimalist Grid",
    thumbnail: "/kerala-wedding-photos/templates/2",
    config: {
      rows: 3,
      cols: 3,
      gap: 16,
      padding: 24
    },
    updatedAt: new Date().toISOString()
  },
  {
    id: "tpl_portrait_showcase",
    name: "Portrait Showcase",
    thumbnail: "/kerala-wedding-photos/templates/3",
    config: {
      rows: 1,
      cols: 2,
      gap: 32,
      padding: 64
    },
    updatedAt: new Date().toISOString()
  },
  {
    id: "tpl_story_board",
    name: "Story Board",
    thumbnail: "/kerala-wedding-photos/templates/4",
    config: {
      rows: 2,
      cols: 4,
      gap: 12,
      padding: 20
    },
    updatedAt: new Date().toISOString()
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; templateId: string }> }
) {
  const { id, templateId } = await params
  const template = DEFAULT_TEMPLATES.find(t => t.id === templateId)
  
  if (template) {
    return NextResponse.json(template)
  }

  // If not found in defaults, return a generic one for newly created templates
  return NextResponse.json({
    id: templateId,
    name: "Custom Template",
    thumbnail: "/placeholder.svg",
    config: {
      rows: 2,
      cols: 2,
      gap: 16,
      padding: 24
    },
    updatedAt: new Date().toISOString()
  })
}
