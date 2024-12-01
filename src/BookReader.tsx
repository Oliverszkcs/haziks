import React from 'react';

interface BookReaderProps {
    bookContent: string;
    theme: string;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const BookReader: React.FC<BookReaderProps> = ({ bookContent, theme, currentPage, onPageChange }) => {
    const pages = bookContent.split('\n\n'); 

    const nextPage = () => {
        if (currentPage < pages.length - 1) {
            onPageChange(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <div style={{ background: theme }}>
            <div>
                <button onClick={prevPage} disabled={currentPage === 0}>
                    Previous
                </button>
                <button onClick={nextPage} disabled={currentPage === pages.length - 1}>
                    Next
                </button>
            </div>
            <div>
                <p>{pages[currentPage]}</p>
            </div>
        </div>
    );
};

export default BookReader;
