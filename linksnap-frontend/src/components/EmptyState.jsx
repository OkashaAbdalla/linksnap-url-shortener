import { useTheme } from "../context/ThemeContext";

function EmptyState() {
  const { darkMode } = useTheme();

  return (
    <div className={`rounded-xl p-8 md:p-12 border text-center ${
      darkMode 
        ? 'bg-[#1a2332] border-gray-800' 
        : 'bg-white border-gray-200'
    }`}>
      <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
        darkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <span className="material-symbols-outlined text-[32px] text-gray-500">link_off</span>
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        No links yet
      </h3>
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Create your first short link by pasting a URL above
      </p>
    </div>
  );
}

export default EmptyState;
