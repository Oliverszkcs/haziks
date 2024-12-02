import React, { useState, useEffect, useRef } from 'react';
import './Bookreader.css';
import SearchBar from './SearchBar';

interface BookReaderProps {
    bookContent: string;
    theme: string;
    currentPage: number;
    onPageChange: (page: number) => void;
    availableBooks: string[];
    onBookSelect: (book: string) => void;
}

const BookReader: React.FC<BookReaderProps> = ({ bookContent, theme, currentPage, onPageChange, availableBooks, onBookSelect }) => {
    const [pages, setPages] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<number[]>([]);
    const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0);
    const [fontSize, setFontSize] = useState<number>(16);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const paginateText = (text: string, fontSize: number) => {
            const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
            const pages: string[] = [];
            let currentPage = '';
            const maxLength = Math.floor(1850 * (18 / fontSize)*(18 / fontSize)); 
            sentences.forEach(sentence => {
                if ((currentPage + sentence).length <= maxLength) {
                    currentPage += sentence + ' ';
                } else {
                    pages.push(currentPage.trim());
                    currentPage = sentence + ' ';
                }
            });

            if (currentPage) {
                pages.push(currentPage.trim());
            }

            return pages;
        };

        setPages(paginateText(bookContent, fontSize));
    }, [bookContent, fontSize]);

    const changePage = (offset: number) => {
        const newPage = currentPage + offset;
        if (newPage >= 0 && newPage < pages.length) {
            onPageChange(newPage);
        }
    };

    const handleSearch = () => {
        const results: number[] = [];
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

    const nextSearchResult = () => {
        if (currentSearchIndex < searchResults.length - 1) {
            const newIndex = currentSearchIndex + 1;
            setCurrentSearchIndex(newIndex);
            onPageChange(searchResults[newIndex]);
        }
    };

    const prevSearchResult = () => {
        if (currentSearchIndex > 0) {
            const newIndex = currentSearchIndex - 1;
            setCurrentSearchIndex(newIndex);
            onPageChange(searchResults[newIndex]);
        }
    };

    const highlightText = (text: string, term: string) => {
        if (!term) return text;
        const parts = text.split(new RegExp(`(${term})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === term.toLowerCase() ? <mark key={index}>{part}</mark> : part
        );
    };

    const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFontSize(parseInt(event.target.value, 10));
    };

    return (
        <div className="book-reader" style={{ background: theme }}>
            <div className="content-wrapper">
                <div className="page-number">
                    <p>Page {currentPage + 1} of {pages.length}</p>
                </div>
                <div className="navigation-buttons">
                    <button onClick={() => changePage(-1)} disabled={currentPage === 0}>
                        Previous
                    </button>
                    <button onClick={() => changePage(1)} disabled={currentPage === pages.length - 1}>
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
                <div ref={contentRef} className="book-content" style={{ fontSize: `${fontSize}px` }}>
                    <p>{highlightText(pages[currentPage], searchTerm)}</p>
                </div>
            </div>
        </div>
    );
};

export default BookReader;
