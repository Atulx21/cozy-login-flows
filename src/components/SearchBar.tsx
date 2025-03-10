
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="sticky top-0 z-10 border-b border-white/10 bg-black/30 p-4 backdrop-blur-lg">
      <form onSubmit={handleSubmit} className="relative">
        <div className="mx-auto flex max-w-3xl items-center rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/20 backdrop-blur-sm">
          <Search className="mr-3 h-5 w-5 text-white/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for songs, artists or moods..."
            className="flex-1 bg-transparent text-white placeholder-white/50 outline-none"
          />
          <button 
            type="submit"
            disabled={loading}
            className="ml-2 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
