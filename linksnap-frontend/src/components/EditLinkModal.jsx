import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function EditLinkModal({ link, onClose, onSave }) {
  const { darkMode } = useTheme();
  const [originalUrl, setOriginalUrl] = useState(link.original_url);
  const [customSlug, setCustomSlug] = useState(link.slug);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [removePassword, setRemovePassword] = useState(false);
  const [qrFgColor, setQrFgColor] = useState(link.qr_style?.fgColor || "#000000");
  const [qrBgColor, setQrBgColor] = useState(link.qr_style?.bgColor || "#FFFFFF");
  const [qrStyle, setQrStyle] = useState(link.qr_style?.style || "squares");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // If link has password and user wants to change/remove it, verify current password
    if (link.has_password && (newPassword || removePassword)) {
      if (!currentPassword) {
        setError("Please enter your current password to make changes");
        return;
      }
    }

    setIsLoading(true);

    try {
      const updates = {
        originalUrl,
        slug: customSlug,
        qrStyle: { fgColor: qrFgColor, bgColor: qrBgColor, style: qrStyle }
      };

      // Include current password for verification if link is protected
      if (link.has_password && (newPassword || removePassword)) {
        updates.currentPassword = currentPassword;
      }

      if (newPassword) {
        updates.password = newPassword;
      } else if (removePassword) {
        updates.password = null;
      }

      await onSave(link.id, updates);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={onClose}>
      <div 
        className={`w-full max-w-2xl rounded-2xl border my-8 max-h-[90vh] flex flex-col ${
          darkMode ? 'bg-[#1a2332] border-gray-800' : 'bg-white border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className={`flex items-center justify-between p-6 border-b sticky top-0 z-20 rounded-t-2xl ${
          darkMode ? 'bg-[#1a2332] border-gray-800' : 'bg-white border-gray-200'
        }`} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Edit Link
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Original URL
            </label>
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${
                darkMode 
                  ? 'bg-[#0c1222] border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              } outline-none focus:border-cyan-500`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Custom Slug
            </label>
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${
                darkMode 
                  ? 'bg-[#0c1222] border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              } outline-none focus:border-cyan-500`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Password Protection {link.has_password && "(Currently Protected)"}
            </label>
            
            {link.has_password && (
              <div className="mb-2">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password to make changes"
                  className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${
                    darkMode 
                      ? 'bg-[#0c1222] border-gray-700 text-white placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  } outline-none focus:border-cyan-500`}
                />
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Required to change or remove password
                </p>
              </div>
            )}
            
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={link.has_password ? "Enter new password (leave empty to keep current)" : "Enter password to protect link"}
              className={`w-full px-4 py-2.5 rounded-xl border transition-colors ${
                darkMode 
                  ? 'bg-[#0c1222] border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              } outline-none focus:border-cyan-500`}
            />
            {link.has_password && (
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={removePassword}
                  onChange={(e) => {
                    setRemovePassword(e.target.checked);
                    if (e.target.checked) {
                      setNewPassword("");
                    }
                  }}
                  className="rounded"
                />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Remove password protection
                </span>
              </label>
            )}
          </div>

          <div className="border-t pt-3 mt-3" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
            <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              QR Code Styling
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Foreground Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={qrFgColor}
                    onChange={(e) => setQrFgColor(e.target.value)}
                    className="w-10 h-9 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={qrFgColor}
                    onChange={(e) => setQrFgColor(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                      darkMode 
                        ? 'bg-[#0c1222] border-gray-700 text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-10 h-9 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                      darkMode 
                        ? 'bg-[#0c1222] border-gray-700 text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <label className={`block text-xs mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                QR Code Style
              </label>
              <div className="flex gap-2">
                {['squares', 'dots', 'rounded'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setQrStyle(style)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      qrStyle === style
                        ? 'bg-cyan-500 text-white'
                        : darkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </form>
        </div>

        {/* Sticky Footer */}
        <div className={`flex gap-3 p-6 border-t sticky bottom-0 z-20 rounded-b-2xl ${
          darkMode ? 'bg-[#1a2332] border-gray-800' : 'bg-white border-gray-200'
        }`} style={{ boxShadow: '0 -2px 8px rgba(0,0,0,0.1)' }}>
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
              darkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLinkModal;
