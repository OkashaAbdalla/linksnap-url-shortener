import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function PasswordPromptModal({ onSubmit, onClose, title = "Password Required", message = "This link is password protected" }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { darkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onSubmit(password);
      onClose();
    } catch (err) {
      setError(err.message || "Invalid password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`rounded-2xl p-6 max-w-sm w-full mx-4 ${darkMode ? 'bg-[#1a2332]' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-yellow-500">lock</span>
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {message}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Enter password"
            autoFocus
            className={`w-full px-4 py-3 rounded-lg border text-sm mb-3 ${
              darkMode 
                ? 'bg-[#252f3f] border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
          />

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
                darkMode 
                  ? 'bg-[#252f3f] hover:bg-[#2d3a4d] text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 rounded-lg text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  Verifying...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lock_open</span>
                  Unlock
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordPromptModal;
