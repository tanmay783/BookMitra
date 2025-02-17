document.addEventListener("DOMContentLoaded", function () {
    const bookList = document.getElementById("book-list");
    const adminBookList = document.getElementById("admin-book-list");
    const uploadForm = document.getElementById("upload-form");
    const loginForm = document.getElementById("login-form");
    const logoutBtn = document.getElementById("logout-btn");

    function loadBooks() {
        const books = JSON.parse(localStorage.getItem("books")) || [];

        if (bookList) {
            bookList.innerHTML = ""; 
            books.forEach((book, index) => {
                const bookElement = document.createElement("div");
                bookElement.classList.add("book");
                bookElement.innerHTML = `
                    <img src="${book.thumbnail}" alt="${book.title}">
                    <h2>${book.title}</h2>
                    <a href="${book.pdf}" target="_blank" download>
                        <button class="download-btn">📥 Download</button>
                    </a>
                `;
                bookList.appendChild(bookElement);
            });
        }

        if (adminBookList) {
            adminBookList.innerHTML = "";
            books.forEach((book, index) => {
                const bookElement = document.createElement("div");
                bookElement.classList.add("book");
                bookElement.innerHTML = `
                    <img src="${book.thumbnail}" alt="${book.title}">
                    <h2>${book.title}</h2>
                    <a href="${book.pdf}" target="_blank" download>
                        <button class="download-btn">📥 Download</button>
                    </a>
                    <button class="delete-btn" onclick="deleteBook(${index})">❌ Delete</button>
                `;
                adminBookList.appendChild(bookElement);
            });
        }
    }

    if (bookList || adminBookList) {
        loadBooks();
    }

    if (uploadForm) {
        uploadForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const title = document.getElementById("title").value;
            const pdfFile = document.getElementById("pdf-file").files[0];
            const thumbnailFile = document.getElementById("thumbnail-file").files[0];

            if (!pdfFile || !thumbnailFile) {
                alert("Please select a PDF and a Thumbnail image.");
                return;
            }

            const pdfReader = new FileReader();
            const thumbReader = new FileReader();

            pdfReader.onload = function (pdfEvent) {
                const pdfUrl = pdfEvent.target.result;

                thumbReader.onload = function (thumbEvent) {
                    const thumbnailUrl = thumbEvent.target.result;

                    const books = JSON.parse(localStorage.getItem("books")) || [];
                    books.push({ title, pdf: pdfUrl, thumbnail: thumbnailUrl });

                    localStorage.setItem("books", JSON.stringify(books));

                    alert("Book Uploaded Successfully!");
                    uploadForm.reset();
                    loadBooks();
                };

                thumbReader.readAsDataURL(thumbnailFile);
            };

            pdfReader.readAsDataURL(pdfFile);
        });
    }

    window.deleteBook = function (index) {
        let books = JSON.parse(localStorage.getItem("books")) || [];
        books.splice(index, 1);
        localStorage.setItem("books", JSON.stringify(books));
        alert("Book Deleted Successfully!");
        loadBooks();
    };

    window.goBack = function () {
        window.history.back();
    };

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const password = document.getElementById("admin-password").value;
            if (password === "BKM20251") {
                localStorage.setItem("admin", "true");
                window.location.href = "admin.html";
            } else {
                alert("Incorrect password!");
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("admin");
            window.location.href = "index.html";
        });
    }

    if (window.location.pathname.includes("admin.html") && !localStorage.getItem("admin")) {
        window.location.href = "login.html";
    }
});
