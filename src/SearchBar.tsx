import React from "react";
import "./styles/SearhBar.css";

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
  searchResults: number[];
  currentSearchIndex: number;
  onNextResult: () => void;
  onPrevResult: () => void;
}

/**
 * A szovegben valo keresest megvalosito fuggveny.
 * @param searchTerm A keresett kifejezes.
 * @param onSearchTermChange A kifejezes valtozasat kezelo fuggveny.
 * @param onSearch A kereses esemenykezeloje.
 * @param searchResults A kereses eredmenyei.
 * @param currentSearchIndex Az aktualis keresesi talalta indexe.
 * @param onNextResult A kovetkezo talalat esemenykezeloje.
 * @param onPrevResult Az elozo talalat esemenykezeloje.
 * @returns A kereso mezot es a navigacios gombokat tartalmazo komponens html kodja.
 */
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
