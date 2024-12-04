import { getAllBooks, getBook, addBook, addNewBook } from "./IndexedDB";
import React from "react";

export const handleBookSelect = async (
  book: any,
  email: string,
  setSelectedBook: React.Dispatch<React.SetStateAction<any>>,
  setBookContent: React.Dispatch<React.SetStateAction<string>>,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => {
  setSelectedBook(book);
  const storedBook = await getBook(book.id);
  if (storedBook) {
    setBookContent(storedBook.content);
  } else {
    const response = await fetch(`/${book.content}`);
    const text = await response.text();
    setBookContent(text);
    addBook({ ...book, content: text });
  }
  setCurrentPage(0);
  const lastPage = localStorage.getItem(`${email}_${book.id}_currentPage`);
  if (lastPage) {
    setCurrentPage(parseInt(lastPage, 10));
  }
  localStorage.setItem(`${email}_lastBookId`, book.id.toString());
};

export const handlePageChange = (
  page: number,
  selectedBook: any,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
) => {
  setCurrentPage(page);
  if (selectedBook) {
    const email = localStorage.getItem("currentUserEmail");
    if (email) {
      localStorage.setItem(
        `${email}_${selectedBook.id}_currentPage`,
        page.toString()
      );
    }
  }
};

export const handleAddNewBook = async (
  books: any[],
  newBookTitle: string,
  newBookContent: string,
  setBooks: React.Dispatch<React.SetStateAction<any[]>>,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setNewBookTitle: React.Dispatch<React.SetStateAction<string>>,
  setNewBookContent: React.Dispatch<React.SetStateAction<string>>
) => {
  const maxId = books.reduce(
    (max, book) => (book.id > max ? book.id : max),
    0
  );
  const newBook = {
    id: maxId + 1,
    title: newBookTitle,
    content: newBookContent,
  };
  await addNewBook(newBook);
  const updatedBooks = [...books, newBook];
  setBooks(updatedBooks);
  setIsModalOpen(false);
  setNewBookTitle("");
  setNewBookContent("");
};