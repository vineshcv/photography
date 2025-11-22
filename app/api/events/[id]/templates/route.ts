import { NextRequest, NextResponse } from "next/server"

const DEFAULT_TEMPLATES = [
  {
    id: "tpl_wedding_classic",
    name: "Classic Wedding Album",
    description: "Elegant wedding album with romantic layouts",
    category: "Wedding",
    thumbnail: "/kerala-wedding-photos/templates/1",
    pages: [
      {
        id: "p1",
        name: "Cover",
        type: "frontPage",
        config: { rows: 1, cols: 1, gap: 0, padding: 0 },
        content: {
          title: "Our Wedding Day",
          subtitle: "A Love Story",
          backgroundImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
          logo: "",
          elements: []
        },
        slots: {}
      },
      {
        id: "p2",
        name: "Ceremony Grid",
        config: { rows: 2, cols: 2, gap: 24, padding: 48 },
        slots: {
          "0-0": { id: "img1", url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop", filename: "ceremony1.jpg" },
          "0-1": { id: "img2", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop", filename: "bride.jpg" },
          "1-0": { id: "img3", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop", filename: "guests.jpg" },
          "1-1": { id: "img4", url: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=400&h=300&fit=crop", filename: "reception.jpg" }
        }
      }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "tpl_minimal_grid",
    name: "Minimalist Grid",
    description: "Clean and modern 9-photo grid layout",
    category: "Modern",
    thumbnail: "/kerala-wedding-photos/templates/2",
    pages: [
      {
        id: "p1",
        name: "Grid Layout",
        config: { rows: 3, cols: 3, gap: 16, padding: 24 },
        slots: {
          "0-0": { id: "img1", url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=300&h=300&fit=crop", filename: "photo1.jpg" },
          "0-1": { id: "img2", url: "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=300&h=300&fit=crop", filename: "photo2.jpg" },
          "0-2": { id: "img3", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=300&h=300&fit=crop", filename: "photo3.jpg" },
          "1-0": { id: "img4", url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=300&h=300&fit=crop", filename: "photo4.jpg" },
          "1-1": { id: "img5", url: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=300&h=300&fit=crop", filename: "photo5.jpg" },
          "1-2": { id: "img6", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=300&h=300&fit=crop", filename: "photo6.jpg" },
          "2-0": { id: "img7", url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=300&h=300&fit=crop", filename: "photo7.jpg" },
          "2-1": { id: "img8", url: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=300&h=300&fit=crop", filename: "photo8.jpg" },
          "2-2": { id: "img9", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=300&fit=crop", filename: "photo9.jpg" }
        }
      }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "tpl_portrait_showcase",
    name: "Portrait Showcase",
    description: "Perfect for portrait and headshot collections",
    category: "Portrait",
    thumbnail: "/kerala-wedding-photos/templates/3",
    pages: [
      {
        id: "p1",
        name: "Cover",
        type: "frontPage",
        config: { rows: 1, cols: 1, gap: 0, padding: 0 },
        content: {
          title: "Portrait Collection",
          subtitle: "Professional Photography",
          backgroundImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop",
          logo: "",
          elements: []
        },
        slots: {}
      },
      {
        id: "p2",
        name: "Portrait Grid",
        config: { rows: 2, cols: 2, gap: 32, padding: 64 },
        slots: {
          "0-0": { id: "img1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop", filename: "portrait1.jpg" },
          "0-1": { id: "img2", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop", filename: "portrait2.jpg" },
          "1-0": { id: "img3", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop", filename: "portrait3.jpg" },
          "1-1": { id: "img4", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop", filename: "portrait4.jpg" }
        }
      }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "tpl_story_board",
    name: "Story Timeline",
    description: "Tell your story chronologically with multiple photos",
    category: "Storytelling",
    thumbnail: "/kerala-wedding-photos/templates/4",
    pages: [
      {
        id: "p1",
        name: "Story Grid",
        config: { rows: 2, cols: 4, gap: 12, padding: 20 },
        slots: {
          "0-0": { id: "img1", url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=200&h=150&fit=crop", filename: "story1.jpg" },
          "0-1": { id: "img2", url: "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=200&h=150&fit=crop", filename: "story2.jpg" },
          "0-2": { id: "img3", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=200&h=150&fit=crop", filename: "story3.jpg" },
          "0-3": { id: "img4", url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=200&h=150&fit=crop", filename: "story4.jpg" },
          "1-0": { id: "img5", url: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=200&h=150&fit=crop", filename: "story5.jpg" },
          "1-1": { id: "img6", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=200&h=150&fit=crop", filename: "story6.jpg" },
          "1-2": { id: "img7", url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=200&h=150&fit=crop", filename: "story7.jpg" },
          "1-3": { id: "img8", url: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=200&h=150&fit=crop", filename: "story8.jpg" }
        }
      }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "tpl_house_warming",
    name: "House Warming Album",
    description: "Celebrate your new home with family and friends",
    category: "Celebration",
    thumbnail: "/kerala-wedding-photos/templates/5",
    pages: [
      {
        id: "p1",
        name: "Welcome Home",
        type: "welcome",
        config: { rows: 1, cols: 1, gap: 0, padding: 0 },
        content: { 
          title: "Our New Home", 
          subtitle: "House Warming Celebration", 
          overlay: true, 
          centered: true,
          backgroundImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
        },
        slots: {}
      },
      {
        id: "p2",
        name: "Celebration Photos",
        config: { rows: 2, cols: 3, gap: 20, padding: 40 },
        slots: {
          "0-0": { id: "img1", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop", filename: "house1.jpg" },
          "0-1": { id: "img2", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop", filename: "house2.jpg" },
          "0-2": { id: "img3", url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop", filename: "house3.jpg" },
          "1-0": { id: "img4", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=200&fit=crop", filename: "guests1.jpg" },
          "1-1": { id: "img5", url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300&h=200&fit=crop", filename: "celebration.jpg" },
          "1-2": { id: "img6", url: "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=300&h=200&fit=crop", filename: "guests2.jpg" }
        }
      }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "tpl_stage_show",
    name: "Stage Show / Performance",
    thumbnail: "/kerala-wedding-photos/templates/6",
    pages: [
      {
        id: "p1",
        name: "Cover",
        type: "frontPage",
        config: { rows: 1, cols: 1, gap: 0, padding: 0 },
        content: {
          title: "Performance Night",
          subtitle: "An Evening of Arts",
          backgroundImage: "",
          logo: "",
          elements: []
        },
        slots: {}
      },
      {
        id: "p2",
        name: "Performance Grid",
        config: { rows: 1, cols: 3, gap: 16, padding: 32 },
        slots: {}
      },
      {
        id: "p3",
        name: "Back Cover",
        type: "lastPage",
        config: { rows: 1, cols: 1, gap: 0, padding: 0 },
        content: {
          backgroundImage: "",
          elements: [
            { id: "e1", type: "text", content: "Thank you for attending!", x: 50, y: 40, fontSize: 24, fontWeight: "bold" },
            { id: "e2", type: "text", content: "Event organized by XYZ Studio\n123 Main St, City\nwww.xyzstudio.com", x: 50, y: 60, fontSize: 14, fontWeight: "normal" }
          ]
        },
        slots: {}
      }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "tpl_birthday",
    name: "Birthday Celebration",
    description: "Make birthday memories last forever",
    category: "Birthday",
    thumbnail: "/kerala-wedding-photos/templates/7",
    pages: [
      {
        id: "p1",
        name: "Birthday Cover",
        type: "frontPage",
        config: { rows: 1, cols: 1, gap: 0, padding: 0 },
        content: {
          title: "Happy Birthday!",
          subtitle: "A Special Day",
          backgroundImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=600&fit=crop",
          logo: "",
          elements: []
        },
        slots: {}
      },
      {
        id: "p2",
        name: "Party Photos",
        config: { rows: 2, cols: 2, gap: 24, padding: 48 },
        slots: {
          "0-0": { id: "img1", url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop", filename: "birthday1.jpg" },
          "0-1": { id: "img2", url: "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=400&h=300&fit=crop", filename: "birthday2.jpg" },
          "1-0": { id: "img3", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop", filename: "birthday3.jpg" },
          "1-1": { id: "img4", url: "https://images.unsplash.com/photo-1525772764200-be829a350797?w=400&h=300&fit=crop", filename: "birthday4.jpg" }
        }
      }
    ],
    updatedAt: new Date().toISOString()
  },
  {
    id: "tpl_corporate",
    name: "Corporate Event",
    description: "Professional layouts for business events and conferences",
    category: "Corporate",
    thumbnail: "/kerala-wedding-photos/templates/1",
    pages: [
      {
        id: "p1",
        name: "Event Cover",
        type: "frontPage",
        config: { rows: 1, cols: 1, gap: 0, padding: 0 },
        content: {
          title: "Annual Conference 2025",
          subtitle: "Building the Future Together",
          backgroundImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
          logo: "",
          elements: []
        },
        slots: {}
      },
      {
        id: "p2",
        name: "Event Highlights",
        config: { rows: 3, cols: 3, gap: 12, padding: 24 },
        slots: {
          "0-0": { id: "img1", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=250&h=200&fit=crop", filename: "conference1.jpg" },
          "0-1": { id: "img2", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=250&h=200&fit=crop", filename: "conference2.jpg" },
          "0-2": { id: "img3", url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=250&h=200&fit=crop", filename: "presentation.jpg" },
          "1-0": { id: "img4", url: "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=250&h=200&fit=crop", filename: "networking1.jpg" },
          "1-1": { id: "img5", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=250&h=200&fit=crop", filename: "networking2.jpg" },
          "1-2": { id: "img6", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=250&h=200&fit=crop", filename: "workshop.jpg" },
          "2-0": { id: "img7", url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=250&h=200&fit=crop", filename: "awards.jpg" },
          "2-1": { id: "img8", url: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=250&h=200&fit=crop", filename: "dinner.jpg" },
          "2-2": { id: "img9", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=250&h=200&fit=crop", filename: "closing.jpg" }
        }
      },
      {
        id: "p3",
        name: "Contact Page",
        type: "lastPage",
        config: { rows: 1, cols: 1, gap: 0, padding: 0 },
        content: {
          backgroundImage: "",
          elements: [
            { id: "e1", type: "text", content: "Thank You", x: 50, y: 30, fontSize: 32, fontWeight: "bold" },
            { id: "e2", type: "text", content: "Company Name\nAddress Line 1\nCity, State ZIP\nPhone: (555) 123-4567\nemail@company.com", x: 50, y: 55, fontSize: 16, fontWeight: "normal" }
          ]
        },
        slots: {}
      }
    ],
    updatedAt: new Date().toISOString()
  }
]

let templates: any[] = [...DEFAULT_TEMPLATES]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // Return mock templates
  return NextResponse.json(templates)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const newTemplate = {
      id: `tpl_${Date.now()}`,
      name: body.name || "Untitled Template",
      thumbnail: "/placeholder.svg?key=new-template",
      pages: [
        {
          id: "p1",
          name: "Default Page",
          config: { rows: 1, cols: 1, gap: 0, padding: 0 },
          slots: {}
        }
      ],
      updatedAt: new Date().toISOString(),
      ...body
    }
    templates = [newTemplate, ...templates]
    return NextResponse.json(newTemplate)
  } catch (error) {
    return NextResponse.json({ message: "Failed to create template" }, { status: 500 })
  }
}
