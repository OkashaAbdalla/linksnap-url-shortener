import { useState } from "react";
import LinkCard from "./LinkCard";
import EmptyState from "./EmptyState";
import LinksSkeleton from "./LinksSkeleton";
import SearchBar from "./SearchBar";

function LinksSection({ links, darkMode, isLoading, onCopy, onDelete, onShowQR }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredLinks = links.filter(link => 
    link.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.long.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedLinks = showAll ? filteredLinks : filteredLinks.slice(0, 6);

  if (isLoading) {
    return <LinksSkeleton darkMode={darkMode} />;
  }

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 md:mb-6">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Recent Snaps ({filteredLinks.length})
        </h3>
        <div className="flex items-center gap-3">
          {links.length > 0 && (
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              darkMode={darkMode} 
            />
          )}
          {filteredLinks.length > 6 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap"
            >
              {showAll ? 'Show Less' : 'View All'}
              <span className="material-symbols-outlined text-[16px]">
                {showAll ? 'expand_less' : 'arrow_forward'}
              </span>
            </button>
          )}
        </div>
      </div>
      
      {links.length === 0 ? (
        <EmptyState />
      ) : filteredLinks.length === 0 ? (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No links match your search
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedLinks.map((link) => (
            <LinkCard 
              key={link.id} 
              link={link} 
              onCopy={onCopy}
              onDelete={onDelete}
              onShowQR={onShowQR}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default LinksSection;
