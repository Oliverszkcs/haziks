import React from "react";
import { Book } from "./types/Book";

interface BookListProps {
  books: Book[];
  onBookSelect: (book: Book) => void;
  title: string;
}

const BookList: React.FC<BookListProps> = ({ books, onBookSelect, title }) => {
  return (
    <div className="book-list">
      <h1>{title}</h1>
      <ul className="book-list-items">
        {books.map((book) => (
          <li
            key={book.id}
            onClick={() => onBookSelect(book)}
            className="book-list-item"
          >
            {book.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
