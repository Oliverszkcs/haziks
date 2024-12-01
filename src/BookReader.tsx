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
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const paginateText = (text: string) => {
            return text.match(/(.|[\r\n]){1,1600}/g) || [];
        };

        setPages(paginateText(bookContent));
    }, [bookContent]);

    const changePage = (offset: number) => {
        const newPage = currentPage + offset;
        if (newPage >= 0 && newPage < pages.length) {
            onPageChange(newPage);
        }
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
                <div ref={contentRef} className="book-content">
                    <p>{pages[currentPage]}</p>
                </div>
            </div>
        </div>
    );
};

export default BookReader;
