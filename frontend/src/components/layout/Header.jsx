/**
 * Header Component
 * Top navigation bar with search
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, X, Video } from 'lucide-react';

export function Header({ onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-yt-black z-50 flex items-center px-4 gap-4">
      {/* Left: Menu & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-full hover:bg-yt-lighter transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <a href="/" className="flex items-center gap-2">
          <Video className="w-8 h-8 text-yt-red" />
          <span className="hidden sm:block text-lg font-semibold">
            VKM
          </span>
        </a>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="input-search w-full pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-yt-lighter"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="ml-2 p-2.5 bg-yt-lighter rounded-full hover:bg-yt-light transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Right: Actions (placeholder for future features) */}
      <div className="flex items-center gap-2">
        {/* Can add user menu, notifications, etc. here */}
      </div>
    </header>
  );
}

export default Header;
