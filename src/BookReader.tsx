import React, { useState, useEffect, useRef } from 'react';
import './Bookreader.css';

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
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const paginateText = (text: string) => {
            const words = text.split(' ');
            const pages: string[] = [];
            let currentPage = '';

            words.forEach(word => {
                if ((currentPage + word).length <= 1600) {
                    currentPage += word + ' ';
                } else {
                    pages.push(currentPage.trim());
                    currentPage = word + ' ';
                }
            });

            if (currentPage) {
                pages.push(currentPage.trim());
            }

            return pages;
        };

        setPages(paginateText(bookContent));
    }, [bookContent]);

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
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                    {searchResults.length > 0 && (
                        <div className="search-navigation">
                            <button onClick={prevSearchResult} disabled={currentSearchIndex === 0}>
                                Previous Result
                            </button>
                            <button onClick={nextSearchResult} disabled={currentSearchIndex === searchResults.length - 1}>
                                Next Result
                            </button>
                        </div>
                    )}
                </div>
                <div ref={contentRef} className="book-content">
                    <p>{highlightText(pages[currentPage], searchTerm)}</p>
                </div>
            </div>
        </div>
    );
};

export default BookReader;
