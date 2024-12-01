import React from 'react';
import { Book } from './types/Book';

interface BookListProps {
  books: Book[];
  onBookSelect: (book: Book) => void;
  title: string; 
}

const BookList: React.FC<BookListProps> = ({ books, onBookSelect, title }) => {
  return (
    <div>
      <h1>{title}</h1> 
      <ul>
        {books.map(book => (
          <li key={book.id} onClick={() => onBookSelect(book)}>
            {book.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
