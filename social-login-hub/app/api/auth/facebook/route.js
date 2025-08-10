import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()
    const { username, password, platform } = body

    console.log("Facebook Login Attempt:", {
      username,
      password: "***hidden***",
      platform,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (username === "demo@facebook.com" && password === "demo123") {
      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          username,
          platform,
        },
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid username or password",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("Facebook API Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
