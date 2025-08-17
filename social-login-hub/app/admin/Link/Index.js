import React, { useState } from "react";

const Index = () => {
    const [encryptedOutput, setEncryptedOutput] = useState("");
    const [finalLink, setFinalLink] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("facebook");
    const [targetUrl, setTargetUrl] = useState("");

    // Encryption using URL-safe Base64
    const encrypt = (url) => {
        const base64 = btoa(unescape(encodeURIComponent(url)));
        return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    };

    // Decryption from URL-safe Base64
    const decrypt = (encodedUrl) => {
        const base64 = encodedUrl.replace(/-/g, "+").replace(/_/g, "/");
        const padding = "=".repeat((4 - (base64.length % 4)) % 4);
        return decodeURIComponent(escape(atob(base64 + padding)));
    };

    const handleLinkGeneration = () => {
        if (!targetUrl.trim()) {
            setEncryptedOutput("");
            setFinalLink("");
            return;
        }

        const encrypted = encrypt(targetUrl);
        setEncryptedOutput(encrypted);

        const domain = window.location.origin; // automatically picks current domain
        setFinalLink(`${domain}/${selectedPlatform}/${encrypted}`);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                alert("Copied to clipboard!");
            })
            .catch(() => {
                alert("Failed to copy to clipboard");
            });
    };

    // For testing decrypt
    const handleDecrypt = () => {
        if (!encryptedOutput) return;
        alert("Decrypted URL: " + decrypt(encryptedOutput));
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white">🔗 Encrypted Link Creator</h2>
                <p className="text-gray-400 mt-1">
                    Create encrypted links with URL-safe output
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Select Platform
                        </label>
                        <select
                            value={selectedPlatform}
                            onChange={(e) => setSelectedPlatform(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="facebook">Facebook</option>
                            <option value="gmail">Gmail</option>
                            <option value="instagram">Instagram</option>
                            <option value="telegram">Telegram</option>
                            <option value="tiktok">TikTok</option>
                            <option value="twitter">Twitter</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="youtube">YouTube</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Target URL
                        </label>
                        <textarea
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleLinkGeneration}
                            className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
                        >
                            🔒 Generate Link
                        </button>
                        <button
                            onClick={() => {
                                setTargetUrl("");
                                setEncryptedOutput("");
                                setFinalLink("");
                            }}
                            className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleDecrypt}
                            disabled={!encryptedOutput}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            🔓 Decrypt
                        </button>
                    </div>
                </div>

                {/* Output Section */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Encrypted String
                        </label>
                        <textarea
                            value={encryptedOutput}
                            readOnly
                            placeholder="Encrypted string will appear here..."
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-md text-green-400 placeholder-gray-500 focus:outline-none resize-none font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Final Generated Link
                        </label>
                        <div className="relative">
                            <input
                                value={finalLink}
                                readOnly
                                placeholder="/platform/encrypted_string"
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-md text-blue-400 placeholder-gray-500 focus:outline-none font-mono"
                            />
                            {finalLink && (
                                <button
                                    onClick={() => copyToClipboard(finalLink)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                                >
                                    Copy
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => copyToClipboard(encryptedOutput)}
                            disabled={!encryptedOutput}
                            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            📋 Copy Encrypted String
                        </button>
                        <button
                            onClick={() => copyToClipboard(finalLink)}
                            disabled={!finalLink}
                            className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            📋 Copy Full Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
