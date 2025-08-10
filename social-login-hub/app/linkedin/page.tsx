export default function LinkedInLogin() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {/* LinkedIn Logo */}
            <h1 className="text-4xl font-bold text-blue-700 mb-8">
              Linked<span className="bg-blue-700 text-white px-1 rounded">in</span>
            </h1>

            <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign in</h2>
              <p className="text-gray-600 mb-6">Stay updated on your professional world</p>

              {/* Login Form */}
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Email or Phone"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="text-left">
                  <a href="#" className="text-blue-600 hover:underline text-sm font-semibold">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
