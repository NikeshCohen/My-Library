// DOM elements
const openModal = document.querySelector(".header-btn");
const manageBooksBtn = document.querySelector(".modal-btn");
const books = document.querySelector(".books");
const demoCard = document.querySelector(".demo-card");
const deleteModal = document.querySelector(".delete-modal");
const confirmDeleteBtn = document.querySelector(".confirm-delete");
const cancelDeleteBtn = document.querySelectorAll(".cancel-delete");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".close-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const addedDateInput = document.getElementById("addedDate");
const ratingInput = document.getElementById("rating");
const tagsInput = document.getElementById("tags");
const readStatusSelect = document.getElementById("readStatus");
const personalNotesTextarea = document.getElementById("personalNotes");

const loadBooksFromStorage = () => {
  const storedBooks = localStorage.getItem("allBooks");
  if (storedBooks) {
    return JSON.parse(storedBooks);
  }
  return [];
};

// Save books to local storage
const saveBooksToStorage = () => {
  localStorage.setItem("allBooks", JSON.stringify(allBooks));
};

// Initialize allBooks with existing books from local storage
const allBooks = loadBooksFromStorage();

// Function to generate the bookCard HTML. I opted to inject the HTML directly to increase ease of readability for other developers
const generateBookCardHTML = ({
  bookTitle,
  author,
  date,
  rating,
  tags,
  status,
  notes,
}) => {
  // Default data validation for non required form elements
  tags = tags === undefined ? "N/A" : tags;
  status = status === undefined ? "Not specified" : status;
  notes = notes === undefined ? "no notes" : notes;

  return `
    <div class="book-card">
      <div class="action-icons">
        <ion-icon name="pencil-outline" class="action-icon edit"></ion-icon>
        <ion-icon name="trash-outline" class="action-icon delete"></ion-icon>
      </div>
      <h2 class="subheading book-title">${bookTitle}</h2>
      <p class="text author">${author}</p>
      <p class="text date-added">Date Added: ${date}</p>
      <p class="text read-status">Read Status: ${status}</p>
      <p class="text rating">Rating: ${rating}/5</p>
      <p class="text tags">Tags: ${tags}</p>
      <div class="notes">
        <p>Notes: ${notes}</p>
      </div>
    </div>
  `;
};

// Function to check localStorage and remove demo card
const checkLocalStorageAndRemoveDemo = () => {
  const storedBooks = localStorage.getItem("allBooks");
  storedBooks ? demoCard.remove() : "";
};

// Function to inject the created HTML into the DOM
const addNewBookCard = (bookData) => {
  const newCard = generateBookCardHTML(bookData);
  books.innerHTML += newCard;
};

// Function to remove a book card from the DOM and update local storage
const removeBookCard = (bookCard) => {
  if (bookCard && bookCard.parentElement) {
    // Get the index of the book card in the DOM
    const index = Array.from(bookCard.parentElement.children).indexOf(bookCard);

    // Remove the book from the array
    const removedBook = allBooks.splice(index, 1)[0];

    // Save the updated books to local storage
    localStorage.setItem("allBooks", JSON.stringify(allBooks));

    // Remove the book card from the DOM
    bookCard.parentElement.removeChild(bookCard);
  }
};

// Function to clear all input values from the form
const clearInputValues = () => {
  titleInput.value = "";
  authorInput.value = "";
  addedDateInput.value = "";
  ratingInput.value = "";
  tagsInput.value = "";
  readStatusSelect.value = "read";
  personalNotesTextarea.value = "";
};

// Function to populate form with books data when users wants to edit an entry
const populateModal = (bookData) => {
  titleInput.value = bookData.bookTitle;
  authorInput.value = bookData.author;
  addedDateInput.value = bookData.date;
  ratingInput.value = bookData.rating;
  tagsInput.value = bookData.tags;
  readStatusSelect.value = bookData.status;
  personalNotesTextarea.value = bookData.notes;
};

// Function to receive the input data from when a user created a new book record and storing it in an object
const getBookData = () => {
  const bookData = {
    bookTitle: titleInput.value,
    author: authorInput.value,
    date: addedDateInput.value,
    rating: ratingInput.value,
    tags: tagsInput.value,
    status: readStatusSelect.value,
    notes: personalNotesTextarea.value,
  };

  // ensuring that the required form fields are filled in
  if (
    !bookData.bookTitle ||
    !bookData.author ||
    !bookData.date ||
    !bookData.rating
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  checkLocalStorageAndRemoveDemo();

  allBooks.push(bookData);
  addNewBookCard(bookData);
  toggleModal(modal, false);
  clearInputValues();

  // Save the updated books to local storage
  localStorage.setItem("allBooks", JSON.stringify(allBooks));
};

// Function to toggle the viability of all modal windows
const toggleModal = (modal, isActive) => {
  if (isActive) {
    modal.classList.add("active");
  } else {
    modal.classList.remove("active");
  }
};

// Modal event listeners
openModal.addEventListener("click", () => toggleModal(modal, true));
closeModal.addEventListener("click", () => toggleModal(modal, false));

manageBooksBtn.addEventListener("click", () => {
  getBookData();

  // Check localStorage and remove demo card
});

// Adding of an event listener to the cancel buttons
cancelDeleteBtn.forEach((btn) => {
  btn.addEventListener("click", () => toggleModal(deleteModal, false));
});

// Using event bubbling for the book section to determine which element to delete if the delete button is clicked
books.addEventListener("click", (event) => {
  const deleteBtn = event.target.closest(".delete");
  const bookCard = event.target.closest(".book-card");

  if (deleteBtn && bookCard) {
    toggleModal(deleteModal, true);

    confirmDeleteBtn.addEventListener("click", () => {
      removeBookCard(bookCard);
      toggleModal(deleteModal, false);
    });
  }
});

// Using event bubbling for the book section to determine if the edit button has been clicked & then populating modal window with card data to allow user to edit the respective data
books.addEventListener("click", (event) => {
  const editIcon = event.target.closest(".edit");

  if (editIcon) {
    const bookCard = editIcon.closest(".book-card");
    // using an object to store data
    const bookData = {
      bookTitle: bookCard.querySelector(".book-title").textContent,
      author: bookCard.querySelector(".author").textContent,
      date: bookCard
        .querySelector(".date-added")
        .textContent.replace("Date Added: ", ""),
      status: bookCard
        .querySelector(".read-status")
        .textContent.replace("Read Status: ", ""),
      rating: bookCard
        .querySelector(".rating")
        .textContent.replace("Rating: ", "")
        .split("/")[0],
      tags: bookCard.querySelector(".tags").textContent.replace("Tags: ", ""),
      notes: bookCard
        .querySelector(".notes p")
        .textContent.replace("Notes: ", ""),
    };

    populateModal(bookData);
    toggleModal(modal, true);
    removeBookCard(bookCard);
  }
});

// Function to initialize the page with book cards
const initializePage = () => {
  // Check if there are any books in the array
  if (allBooks.length > 0) {
    // Loop through each book in the array and create a card
    allBooks.forEach((bookData) => {
      addNewBookCard(bookData);
    });
  }
};

// Call the function when the page loads
window.addEventListener("load", () => {
  initializePage();
  //   // When page loads check the length of the stored book, if greater then > 0 then check if demoCard is in the DOM. If it exists then remove it from the DOM. Spent about an hour trying to figure out why this wasn't working only to realize that i created the demoCard variable in line 5 and it did not exist when the page loads which is why the card wasn't deleting🤣

  const storedBooks = localStorage.getItem("allBooks");
  const parsedBooks = JSON.parse(storedBooks);

  const demoCard = document.querySelector(".demo-card");

  const removeCard = () => {
    if (demoCard) {
      demoCard.remove();
    }
  };

  console.log(parsedBooks.length);
  parsedBooks.length > 0 ? removeCard() : console.log(false);
});
