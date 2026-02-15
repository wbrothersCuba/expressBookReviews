const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const {username, password} = req.body;
    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

function getBooks(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(books);
        },1000);
    });
}

function getBooksDetails(isbn){
    return new Promise((resolve, reject)=>{
        if (!books[isbn]) {
            throw new Error("No books available fot that isbn");
        }
        setTimeout(()=>{
            resolve(books[isbn]);
        },1000);
    });
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    getBooks()
    .then((data)=>{
        return res.status(200).json(data);
    })
    .catch((error)=>{
         return res.status(500).json({ message: "Error fetching books", error });
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;
    getBooksDetails(isbn)
    .then((data)=>{
        return res.status(200).json(data);
    })
    .catch((error)=>{
        return res.status(404).json({ message: error.message });
    })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;
    let result = [];
    for(let key in books){
        if (books[key].author === author) {
            result.push({ [key]: books[key] });
        }
    }
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(404).json({ message: "Author not found" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const {title} = req.params;
    let result = [];
    for(let key in books){
        if (books[key].title === title) {
            result.push({ [key]: books[key] });
        }
    }
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(404).json({ message: "Title not found" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const {isbn} = req.params;
    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
