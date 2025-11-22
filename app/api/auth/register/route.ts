import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      name, 
      userType, 
      phone, 
      businessName, 
      location, 
      experience, 
      website, 
      bio 
    } = body

    // Required fields validation
    if (!email || !password || !name || !phone || !location || !experience) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // If studio, business name is required
    if (userType === "studio" && !businessName) {
      return NextResponse.json(
        { message: "Business name is required for studios" },
        { status: 400 }
      )
    }

    // Mock user creation with all details
    const user = {
      id: `user_${Date.now()}`,
      email,
      name,
      userType: userType || "freelancer",
      phone,
      businessName: userType === "studio" ? businessName : null,
      location,
      experience: parseInt(experience) || 0,
      website: website || null,
      bio: bio || null,
      createdAt: new Date().toISOString(),
    }

    const token = `mock_token_${Date.now()}`

    return NextResponse.json({ token, user })
  } catch (error) {
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    )
  }
}
