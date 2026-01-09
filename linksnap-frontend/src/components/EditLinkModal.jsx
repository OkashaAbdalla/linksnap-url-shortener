import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function EditLinkModal({ link, onClose, onSave }) {
  const { darkMode } = useTheme();
  const [originalUrl, setOriginalUrl] = useState(link.original_url);
  const [customSlug, setCustomSlug] = useState(link.slug);
  const [password, setPassword] = useState("");
  const [removePassword, setRemovePassword] = useState(false);
  const [qrFgColor, setQrFgColor] = useState(link.qr_style?.fgColor || "#000000");
  const [qrBgColor, setQrBgColor] = useState(link.qr_style?.bgColor || "#FFFFFF");
  const [qrStyle, setQrStyle] = useState(link.qr_style?.style || "squares");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const updates = {
        originalUrl,
        slug: customSlug,
        qrStyle: { fgColor: qrFgColor, bgColor: qrBgColor, style: qrStyle }
      };

      if (password) {
        updates.password = password;
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className={`w-full max-w-2xl rounded-2xl border p-6 ${
          darkMode ? 'bg-[#1a2332] border-gray-800' : 'bg-white border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
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

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Original URL
            </label>
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                darkMode 
                  ? 'bg-[#0c1222] border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              } outline-none focus:border-cyan-500`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Custom Slug
            </label>
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                darkMode 
                  ? 'bg-[#0c1222] border-gray-700 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              } outline-none focus:border-cyan-500`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Password Protection {link.has_password && "(Currently Protected)"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={link.has_password ? "Enter new password to change" : "Leave empty for no password"}
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
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
                  onChange={(e) => setRemovePassword(e.target.checked)}
                  className="rounded"
                />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Remove password protection
                </span>
              </label>
            )}
          </div>

          <div className="border-t pt-4 mt-4" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
            <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              QR Code Styling
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Foreground Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={qrFgColor}
                    onChange={(e) => setQrFgColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
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
                <label className={`block text-sm mb-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
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

            <div className="mt-4">
              <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                QR Code Style
              </label>
              <div className="flex gap-2">
                {['squares', 'dots', 'rounded'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setQrStyle(style)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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

          <div className="flex gap-3 pt-4">
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
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLinkModal;
