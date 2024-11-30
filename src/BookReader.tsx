import React, { useState } from 'react';

interface BookReaderProps {
    bookContent: string;
    theme: string;
}

const BookReader: React.FC<BookReaderProps> = ({ bookContent, theme }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const pages = bookContent.split('\n\n'); 

    const nextPage = () => {
        if (currentPage < pages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
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