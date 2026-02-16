const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios").default;

console.log("BASE_URL in general:", process.env.BASE_URL);
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get("/all", function (req, res) {
  return res.status(200).json(books);
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get(`${process.env.BASE_URL}/all`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`${process.env.BASE_URL}/all`);
    const books = response.data;
    if (!books[isbn]) {
      throw new Error("No books available fot that isbn");
    }
    return res.status(200).json(books[isbn]);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const { author } = req.params;
  try {
    const response = await axios.get(`${process.env.BASE_URL}/all`);
    const books = response.data;
    let result = [];
    for (let key in books) {
      if (books[key].author === author) {
        result.push({ [key]: books[key] });
      }
    }
    if (result.length > 0) {
      return res.status(200).json(result);
    } else throw new Error("Author not found");
  } catch (error) {
    return res.status(500).json({ message: error.message, error });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const { title } = req.params;
  try {
    const response = await axios.get(`${process.env.BASE_URL}/all`);
    const books = response.data;
    let result = [];
    for (let key in books) {
      if (books[key].title === title) {
        result.push({ [key]: books[key] });
      }
    }
    if (result.length > 0) {
      return res.status(200).json(result);
    } else throw new Error("Author not found");
  } catch (error) {
    return res.status(500).json({ message: error.message, error });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  return res
    .status(200)
    .json({ title: books[isbn].title, reviews: books[isbn].reviews });
});

module.exports.general = public_users;
