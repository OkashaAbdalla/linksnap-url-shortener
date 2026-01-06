function LinksSkeleton({ darkMode }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className={`h-6 w-32 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`rounded-xl p-5 border animate-pulse ${
              darkMode ? 'bg-[#1a2332] border-gray-800' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <div className={`w-6 h-6 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            </div>
            <div className={`h-5 w-32 rounded mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-4 w-full rounded mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-8 w-full rounded mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className="flex gap-2 pt-3">
              <div className={`h-9 w-20 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <div className={`h-9 flex-1 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <div className={`h-9 flex-1 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LinksSkeleton;
