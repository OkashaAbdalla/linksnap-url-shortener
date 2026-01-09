import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { api } from "../services/api";

function PasswordPrompt() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.verifyLinkPassword(slug, password);
      if (response.verified && response.url) {
        // Redirect to the actual URL
        window.location.href = response.url;
      }
    } catch (err) {
      setError(err.message || "Invalid password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${darkMode ? 'bg-[#0c1222]' : 'bg-[#f8fafc]'}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl border ${darkMode ? 'bg-[#1a2332] border-gray-800' : 'bg-white border-gray-200 shadow-lg'}`}>
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>
        </div>

        <h1 className={`text-2xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Password Protected Link
        </h1>
        <p className={`text-center mb-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          This link is password protected. Please enter the password to continue.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                darkMode 
                  ? 'bg-[#0c1222] border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500'
              } outline-none`}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Continue"}
          </button>
        </form>

        <div className={`mt-6 text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Don't have the password? Contact the link owner.
        </div>
      </div>
    </div>
  );
}

export default PasswordPrompt;
