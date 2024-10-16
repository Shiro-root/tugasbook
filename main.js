document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  const checkbox = document.getElementById("bookFormIsComplete");
  const submitButton = document.getElementById("bookFormSubmit");
  const submitButtonText = submitButton.querySelector("span");

  function updateSubmitButtonText() {
    if (checkbox.checked) {
      submitButtonText.textContent = "Selesai dibaca";
    } else {
      submitButtonText.textContent = "Belum selesai dibaca";
    }
  }

  updateSubmitButtonText();
  checkbox.addEventListener("change", updateSubmitButtonText);
  bookForm.addEventListener("submit", addBook);
  searchBookForm.addEventListener("submit", searchBook);

  function addBook(event) {
    event.preventDefault();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    const book = {
      id: Date.now().toString(),
      title,
      author,
      year,
      isComplete,
    };

    const bookElement = createBookElement(book);
    if (isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }

    saveBookToLocalStorage(book);
    bookForm.reset();
    updateSubmitButtonText();
  }

  function searchBook(event) {
    event.preventDefault();
    const searchTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const bookItems = document.querySelectorAll("[data-testid='bookItem']");

    bookItems.forEach((book) => {
      const title = book
        .querySelector('[data-testid="bookItemTitle"]')
        .textContent.toLowerCase();
      if (title.includes(searchTitle)) {
        book.style.display = "block";
      } else {
        book.style.display = "none";
      }
    });
  }

  function createBookElement(book) {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");
    bookElement.classList.add("bg-white", "p-6", "rounded-lg", "shadow-lg");

    bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle" class="text-xl font-bold mb-2">${
          book.title
        }</h3>
        <p data-testid="bookItemAuthor" class="text-gray-700 mb-1">Penulis: ${
          book.author
        }</p>
        <p data-testid="bookItemYear" class="text-gray-700 mb-4">Tahun: ${
          book.year
        }</p>
        <div class="flex space-x-2">
          <button data-testid="bookItemIsCompleteButton" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
            ${book.isComplete ? "Selesai dibaca" : "Belum selesai dibaca"}
          </button>
          <button data-testid="bookItemDeleteButton" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Hapus Buku</button>
          <button data-testid="bookItemEditButton" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700">Edit Buku</button>
        </div>
      `;

    bookElement
      .querySelector('[data-testid="bookItemIsCompleteButton"]')
      .addEventListener("click", toggleBookStatus);
    bookElement
      .querySelector('[data-testid="bookItemDeleteButton"]')
      .addEventListener("click", deleteBook);
    bookElement
      .querySelector('[data-testid="bookItemEditButton"]')
      .addEventListener("click", editBook);
    return bookElement;
  }

  function toggleBookStatus(event) {
    const bookElement = event.target.closest('[data-testid="bookItem"]');
    const bookId = bookElement.getAttribute("data-bookid");
    const isComplete = bookElement.closest("#completeBookList");

    // Update book status
    const button = event.target;
    button.textContent = isComplete ? "Belum selesai dibaca" : "Selesai dibaca";

    // Move to the other list
    if (isComplete) {
      incompleteBookList.appendChild(bookElement);
    } else {
      completeBookList.appendChild(bookElement);
    }

    // Update local storage
    const books = getBooksFromLocalStorage();
    const book = books.find((b) => b.id === bookId);
    book.isComplete = !book.isComplete;
    saveBooksToLocalStorage(books);
  }

  function deleteBook(event) {
    const bookElement = event.target.closest('[data-testid="bookItem"]');
    const bookId = bookElement.getAttribute("data-bookid");
    bookElement.remove();

    let books = getBooksFromLocalStorage();
    books = books.filter((b) => b.id !== bookId);
    saveBooksToLocalStorage(books);
  }

  function editBook(event) {
    const bookElement = event.target.closest('[data-testid="bookItem"]');
    const bookId = bookElement.getAttribute("data-bookid");
    const title = bookElement.querySelector(
      '[data-testid="bookItemTitle"]'
    ).textContent;
    const author = bookElement
      .querySelector('[data-testid="bookItemAuthor"]')
      .textContent.replace("Penulis: ", "");
    const year = bookElement
      .querySelector('[data-testid="bookItemYear"]')
      .textContent.replace("Tahun: ", "");

    document.getElementById("bookFormTitle").value = title;
    document.getElementById("bookFormAuthor").value = author;
    document.getElementById("bookFormYear").value = year;
    document.getElementById("bookFormIsComplete").checked = bookElement.closest(
      "#completeBookList"
    )
      ? true
      : false;

    deleteBook(event);
  }

  function saveBookToLocalStorage(book) {
    const books = getBooksFromLocalStorage();
    books.push(book);
    saveBooksToLocalStorage(books);
  }

  function saveBooksToLocalStorage(books) {
    localStorage.setItem("books", JSON.stringify(books));
  }

  function getBooksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("books")) || [];
  }

  function loadBooks() {
    const books = getBooksFromLocalStorage();
    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  loadBooks();
});
