import React, { useState, useEffect, useRef } from "react";
import "./styles/Bookreader.css";
import SearchBar from "./SearchBar";
import { Console, log } from "console";

interface BookReaderProps {
  bookContent: string;
  theme: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  availableBooks: string[];
  onBookSelect: (book: string) => void;
}

/**
 * Ez a konyv kozepso komponensee ahol a konyv olvasasa valosul meg.
 * @param bookContent A kivalasztott konyv tartalma.
 * @param theme Az aktualis tema.
 * @param currentPage Az aktualis oldalszam.
 * @param onPageChange Az oldalvaltas esemenykezeloje.
 * @param availableBooks Az elerheto konyvek listaja.
 * @param onBookSelect A konyv kivalasztas kezelesenek fuggvenye.
 * @returns a konvy olvaso komponens html kodja.
 */
const BookReader: React.FC<BookReaderProps> = ({
  bookContent,
  theme,
  currentPage,
  onPageChange,
  availableBooks,
  onBookSelect,
}) => {
  const [pages, setPages] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(16);
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * A konyv tartalmanak oldalakra bontasa, minden uj oldal a mondat befejezesvel kezdodik,
   *  tehat nincs felbehagyott mondat.
   * @param text A konyv tartalma stringkent.
   * @param fontSize Az aktualis betumeret.
   */
  useEffect(() => {
    const paginateText = (text: string, fontSize: number) => {
      const sentences = text.match(/[^.!?]+[.!?]+/g) || []; // Darabolja a szoveget mondatokra, a megadott mondatkifejezo jelek alapjan.
      const pages: string[] = [];
      let currentPage = "";

      // Az oldal maximalis hossza, a betumeret fuggvenyeben, azert hogy ne logjon ki a szoveg.
      const maxLength = Math.floor(1850 * (16 / fontSize) * (16 / fontSize));

      /**
       * A mondatokat hozzadja  az adott oldalhoz.
       */
      sentences.forEach((sentence) => {
        if ((currentPage + sentence).length <= maxLength) {
          currentPage += sentence + " ";
        } else {
          pages.push(currentPage.trim());
          currentPage = sentence + " ";
        }
      });

      if (currentPage) {
        pages.push(currentPage.trim());
      }

      return pages;
    };

    /**
     * Az oldalak beallitasa a konyv tartalma alapjan.
     * Ez azert kell mert a betumeret valtozhat.
     */
    setPages(paginateText(bookContent, fontSize));
  }, [bookContent, fontSize]);

  /**
   * Lapozas kezelese
   */
  const changePage = (lastPage: number) => {
    const newPage = currentPage + lastPage;
    if (newPage >= 0 && newPage < pages.length) {
      onPageChange(newPage);
    }
  };

  /**
   * A szovegben valo keresest valositja meg.
   */
  const handleSearch = () => {
    const results: number[] = [];

    /**
     * Megkeresi az osszes oldalt ahol a keresett szo szerepel.
     */
    pages.forEach((page, index) => {
      if (page.includes(searchTerm)) {
        results.push(index);
      }
    });
    
    setSearchResults(results);
    if (results.length > 0) {
      setCurrentSearchIndex(0);
      onPageChange(results[0]);
    }
  };

  /**
   * A kovetkezo keresesi eredmenyt mutatja meg.
   */
  const nextSearchResult = () => {
    if (currentSearchIndex < searchResults.length - 1) {
      const newIndex = currentSearchIndex + 1;
      setCurrentSearchIndex(newIndex);
      onPageChange(searchResults[newIndex]);
    }
  };

  /**
   * Ugyanaz mint a a fenti csak
   */
  const prevSearchResult = () => {
    if (currentSearchIndex > 0) {
      const newIndex = currentSearchIndex - 1;
      setCurrentSearchIndex(newIndex);
      onPageChange(searchResults[newIndex]);
    }
  };

  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(parseInt(event.target.value, 10));
  };

  return (
    <div className="book-reader" style={{ background: theme }}>
      <div className="content-wrapper">
        <div className="page-number">
          <p>
            Page {currentPage + 1} of {pages.length}
          </p>
        </div>
        <div className="navigation-buttons">
          <button onClick={() => changePage(-1)} disabled={currentPage === 0}>
            Previous
          </button>
          <button
            onClick={() => changePage(1)}
            disabled={currentPage === pages.length - 1}
          >
            Next
          </button>
        </div>
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
          searchResults={searchResults}
          currentSearchIndex={currentSearchIndex}
          onNextResult={nextSearchResult}
          onPrevResult={prevSearchResult}
        />
        <div className="font-size-control">
          <label htmlFor="font-size">Font Size: </label>
          <input
            type="number"
            id="font-size"
            value={fontSize}
            onChange={handleFontSizeChange}
            min="11"
            max="30"
          />
        </div>
        <div
          ref={contentRef}
          className="book-content"
          style={{ fontSize: `${fontSize}px` }}
        >
          <p>{highlightText(pages[currentPage], searchTerm)}</p>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
