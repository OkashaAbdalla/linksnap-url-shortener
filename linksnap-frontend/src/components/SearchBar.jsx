function SearchBar({ value, onChange, darkMode }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
      darkMode 
        ? 'bg-[#1a2332] border-gray-700 focus-within:border-cyan-500/50' 
        : 'bg-white border-gray-200 focus-within:border-cyan-500'
    }`}>
      <span className="material-symbols-outlined text-[18px] text-gray-500">search</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search links..."
        className={`bg-transparent outline-none text-sm w-32 sm:w-40 ${
          darkMode ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'
        }`}
      />
      {value && (
        <button onClick={() => onChange("")} className="text-gray-500 hover:text-gray-400">
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
