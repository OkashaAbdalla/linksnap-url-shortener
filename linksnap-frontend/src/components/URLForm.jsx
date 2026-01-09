import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { SHORT_URL_BASE } from "../services/api";

function URLForm({ onShorten, isLoading }) {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [password, setPassword] = useState("");
  const [qrFgColor, setQrFgColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#FFFFFF");
  const [qrStyle, setQrStyle] = useState("squares");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const { darkMode } = useTheme();

  // Extract domain for display (e.g., "localhost:3001/" from "http://localhost:3001")
  const shortDomain = SHORT_URL_BASE.replace(/^https?:\/\//, '') + '/';

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }
    
    let finalUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      finalUrl = `https://${url}`;
    }
    
    if (!validateUrl(finalUrl)) {
      setError("Please enter a valid URL");
      return;
    }

    if (customSlug && !/^[a-zA-Z0-9_-]{3,20}$/.test(customSlug)) {
      setError("Custom slug must be 3-20 characters (letters, numbers, - or _)");
      return;
    }
    
    onShorten(finalUrl, customSlug || null, password || null, {
      fgColor: qrFgColor,
      bgColor: qrBgColor,
      style: qrStyle
    });
    setUrl("");
    setCustomSlug("");
    setPassword("");
    setQrFgColor("#000000");
    setQrBgColor("#FFFFFF");
    setQrStyle("squares");
  };

  return (
    <section className="text-center py-8 md:py-12">
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Shorten, Share, Analyze.
      </h2>
      <p className={`mb-6 max-w-md mx-auto text-sm md:text-base ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Create powerful short links in seconds and track their performance in real-time.
      </p>
      
      <form className="max-w-xl mx-auto" onSubmit={handleSubmit}>
        <div className={`flex flex-col sm:flex-row items-center gap-2 rounded-2xl sm:rounded-full p-2 border transition-all duration-300 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_30px_rgba(6,182,212,0.2)] ${
          darkMode ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-300 shadow-sm'
        } ${error ? 'border-red-500/50' : ''}`}>
          <div className="flex items-center flex-1 w-full sm:w-auto pl-4">
            <span className="material-symbols-outlined text-gray-500 mr-3">link</span>
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              placeholder="Paste your long URL here..."
              className={`flex-1 bg-transparent placeholder:text-gray-500 outline-none text-sm py-3 sm:py-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 rounded-xl sm:rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? (
              <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>Shortening...</>
            ) : (
              <>Shorten URL<span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
            )}
          </button>
        </div>

        {/* Advanced options toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`mt-3 text-sm flex items-center gap-1 mx-auto ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}
        >
          <span className="material-symbols-outlined text-[16px]">{showAdvanced ? 'expand_less' : 'expand_more'}</span>
          {showAdvanced ? 'Hide' : 'Show'} advanced options
        </button>

        {/* Custom slug input */}
        {showAdvanced && (
          <div className={`mt-3 p-4 rounded-xl border space-y-4 ${darkMode ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200'}`}>
            <div>
              <label className={`block text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Custom Slug
              </label>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{shortDomain}</span>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="custom-slug"
                  maxLength={20}
                  className={`flex-1 bg-transparent outline-none text-sm ${darkMode ? 'text-white placeholder:text-gray-600' : 'text-gray-900 placeholder:text-gray-400'}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Password Protection (Optional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to protect link"
                className={`w-full px-3 py-2 rounded-lg border text-sm ${
                  darkMode 
                    ? 'bg-[#0c1222] border-gray-700 text-white placeholder:text-gray-600' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                } outline-none focus:border-cyan-500`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                QR Code Styling
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Foreground
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                      className="w-10 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                      className={`flex-1 px-2 py-1 rounded border text-xs ${
                        darkMode 
                          ? 'bg-[#0c1222] border-gray-700 text-white' 
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Background
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-10 h-8 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className={`flex-1 px-2 py-1 rounded border text-xs ${
                        darkMode 
                          ? 'bg-[#0c1222] border-gray-700 text-white' 
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {['squares', 'dots', 'rounded'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setQrStyle(style)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      qrStyle === style
                        ? 'bg-cyan-500 text-white'
                        : darkMode
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm mt-3 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {error}
          </p>
        )}
      </form>
    </section>
  );
}

export default URLForm;
