import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Mock authentication - accept any credentials
    const user = {
      id: `user_${Date.now()}`,
      email,
      name: email.split("@")[0],
    }

    const token = `mock_token_${Date.now()}`

    return NextResponse.json({ token, user })
  } catch (error) {
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    )
  }
}
