const DB_NAME = "EBookReaderDB";
const DB_VERSION = 1;
const STORE_NAME = "books";

/**
 * A konyveket tarolo indexeddb adatbazis.
 * @returns Az adatbazis objektum.
 */
export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

/**
 * Hozzadja az adatbazishoz a konyvet
 * @param book A konyv objektum.
 */
export const addBook = async (book: any) => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  store.add(book);
};

/**
 * Uj konyvet ad  az adatbazishoz.
 * @param book a konvy objektum.
 * @returns A sikeresseg.
 */
export const addNewBook = async (book: any) => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.put(book);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * Viszaadja a konyvet a parameterul megadott azonosito alapjan.
 * @param id A keresett konyv id-je.
 * @returns Ha talal a konyvet, akkor a konyv objektumot ellenkezo esetben hibat.
 */
export const getBook = async (id: number): Promise<any> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.get(id);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * Lekerdezi az osszes konyvet az adatbazisbol.
 * @returns Az osszes konyv listaja, amennyiben ez sikeres, amugy erorr.
 */
export const getAllBooks = async (): Promise<any[]> => {
  const db = await openDB();
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
};
