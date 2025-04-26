const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username, password) => { //returns boolean
  //write code to check is the username is valid
  for (let item in users) {
    // console.log(users[item])
    if (users[item].userName == username && users[item].password == password) {
      return true;
    }
  }
  return false;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  for (let item of users) {
    if (item.userName == username && item.password == password) {
      return true;
    }
  }
  return false;

}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { userName, password } = req.body;
  if (isValid(userName, password)) {
    const token = jwt.sign({ userName, password }, "fingerprint_customer");
    req.session.accessToken = token;
    res.status(200).send({ message: "User has successfully logged in " })
  } else {
    res.status(403).send({ message: "Invalid Credentials." });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  const isbn = req.params.isbn;

  // console.log("review add", review)
  if (authenticatedUser(req.userInfo.userName, req.userInfo.password)) {
    books[isbn].reviews[req.userInfo.userName] = review.replace("-", " ");
    console.log(books[isbn])
    return res.status(200).send({ message: "review has been successfully added" });
  } else {
    return res.status(403).send({ message: "there was an error in adding review" });
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;

  // console.log("review add", review)
  if (authenticatedUser(req.userInfo.userName, req.userInfo.password)) {
    delete books[isbn].reviews[req.userInfo.userName]
    console.log(books[isbn])
    return res.status(200).send({ message: "review has been successfully deleted" });
  } else {
    return res.status(403).send({ message: "there was an error in deleting review" });
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
