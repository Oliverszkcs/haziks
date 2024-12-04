import React from "react";
import "./styles/Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNewBook: () => void;
  newBookTitle: string;
  setNewBookTitle: (title: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Az uj konyv hozzaadasa "menuje".
 * @param isOpen A lathatosag jelenlegi allapota.
 * @param onClose A modal bezarasa esemenykezeloje.
 * @param onAddNewBook Az uj konyv hozzadasank esemenykezeloje.
 * @param newBookTitle Az uj konyv cime.
 * @param setNewBookTitle Az uj konyv cimet beallito fuggveny.
 * @param handleFileUpload A fajl feltoltes esemenykezeloje.
 * @returns a modal(uj hozzadas menu) html kodja.
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onAddNewBook,
  newBookTitle,
  setNewBookTitle,
  handleFileUpload,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add New Book</h2>
        <label>
          Title:
          <input
            type="text"
            value={newBookTitle}
            onChange={(e) => setNewBookTitle(e.target.value)}
          />
        </label>
        <label>
          Content:
          <input type="file" accept=".txt" onChange={handleFileUpload} />
        </label>
        <button
          onClick={onAddNewBook}
          disabled={
            !newBookTitle ||
            !(document.querySelector('input[type="file"]') as HTMLInputElement)
              ?.files?.length
          }
        >
          Add Book
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
