const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    return users.some((user) => user.username === username)
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let valid = user.filter((user) => user.username === username && user.password === password);
    if (valid.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(404).json({ message: "Body Empty" });
    }
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.user.data;
    const { isbn } = req.params;
    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
    const reviewsBooks = books[isbn].reviews;
    reviewsBooks[username] = req.body.review;
    return res.status(202).json({
        message: "Review added/updated successfully",
        reviews: reviewsBooks,
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.user.data;
    const { isbn } = req.params;
    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
    delete books[isbn].reviews[username];
    return res.status(202).json({
        message: "Review deleted successfully",
        reviews: reviewsBooks,
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;