import React from "react";
import "./SearhBar.css";

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
  searchResults: number[];
  currentSearchIndex: number;
  onNextResult: () => void;
  onPrevResult: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  onSearch,
  searchResults,
  currentSearchIndex,
  onNextResult,
  onPrevResult,
}) => {
  return (
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
        <button onClick={onSearch}>Search</button>
      </div>
      {searchResults.length > 0 && (
        <div className="search-navigation">
          <button onClick={onPrevResult} disabled={currentSearchIndex === 0}>
            Previous result
          </button>
          <button
            onClick={onNextResult}
            disabled={currentSearchIndex === searchResults.length - 1}
          >
            Next result
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
