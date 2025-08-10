import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()
    const { username, phoneNumber, password, loginMethod, platform } = body

    console.log("TikTok Login Attempt:", {
      username,
      phoneNumber,
      password: "***hidden***",
      loginMethod,
      platform,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (
      (loginMethod === "email" && username === "demo@tiktok.com" && password === "demo123") ||
      (loginMethod === "phone" && phoneNumber === "3001234567" && password === "demo123")
    ) {
      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          username: username || phoneNumber,
          platform,
        },
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid credentials",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("TikTok API Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
