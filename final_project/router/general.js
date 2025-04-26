const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function UserExists(userName) {
  for (let i = 0; i < users.length; i++) {
    if (user[i].userName == userName) {
      return true;
    }
  }
  return false;
}
public_users.post("/register", (req, res) => {
  //Write your code here
  const { userName, password } = req.body;
  if (!UserExists(userName)) {

    users.push({ userName, password })

    return res.status(200).send({ message: "User has been registered successfully" });

  } else {
    return res.status(403).send({ message: "User already exists" });
  }

  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  // return res.status(200).send(books);
  const getAllBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books)
    }, 1000);
  })

  getAllBooks()
    .then((books) => {
      res.send(200).send(books)
    })
    .catch(err => {
      res.status(500).send({ message: "there was error getting the books" })
    })

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const getBookByISBN = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (book) {
          resolve(book)
        } else {
          reject();
        }
      }, 1000)
    })
  }
  try {
    return res.status(200).send(book)
  } catch (error) {
    res.status(404).send({ msg: "Book not found with this isbn" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const booksLength = Object.keys(books).length;
  const authorName = req.params.author;

  console.log(authorName)
  const getBooksByAuthor = () => {
    const getBooks = [];
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (let i = 1; i < booksLength; i++) {
          if (books[i]?.author && books[i].author.replace(" ", "-") == authorName) {
            getBooks.push(books[i]);
          }
        }
        if (getBooks.length > 0) {
          resolve(getBooks)
        } else {
          reject();
        }
      }, 1000);
    })
  }

  try {
    const sendingBooks = await getBooksByAuthor();
    return res.status(200).send(sendingBooks)
  } catch (error) {
    res.status(404).json({ message: "No book with this author exists in library" });
  }

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const titleName = req.params.title;
  const sendingBooks = [];

  const getBooksByTitle = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const getBooks = []
        for (let [key, value] of Object.entries(books)) {

          if (value?.title && value?.title.replaceAll(" ", "-") == titleName) {
            getBooks.push(value);
          }

        }
        if (getBooks.length > 0) {
          resolve(getBooks)
        } else {
          reject();
        }
      }, 1000);
    })
  }

  try {
    sendingBooks = getBooksByTitle();
    return res.status(200).send(sendingBooks);
  } catch (error) {
    return res.status(404).json({ message: "No book with this title found" });
  }

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(book.reviews)
  } else {
    res.status(404).send({ msg: "Book not found with this isbn" });
  }

});

module.exports.general = public_users;
