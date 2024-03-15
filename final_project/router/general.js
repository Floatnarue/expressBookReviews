const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios') ; 

const doesExist= (username)=> {
  return users.some((user) => user.username === username);
};


public_users.post("/register", (req,res) => {
  const username = req.body.username ;
  const password = req.body.password ;
  if (username && password) {
    if(!doesExist(username)) {
      users.push({"username" : username , "password" : password}) ;
      return res.status(200).json({message: "User successfully register"});
      
    }else {
      return res.status(404).json({message: "User already existed"});
    }
    
  } else {
    return res.status(404).json({message: "Unable to register user."});
  }
  
});




const getAllBooks  = async () =>{
  return books;
};


// Get the book list available in the shop
public_users.get('/', async(req, res) => {
  //Write your code here
  try {
    const allBooks = await getAllBooks();
    return res.status(200).send(JSON.stringify(allBooks,null,4));
  }
  catch(e) {
    res.status(500).send(e);
  }
    
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = parseInt(req.params.isbn) ;
  const targetBook = await books[isbn] ;
  if (!targetBook) {
    return res.status(404).json({message : "ISBN not found"});
  }else {
    return res.status(200).json(targetBook);
  }
  
  
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const auth  = req.params.author ;
  const matchingBook =Object.values(books).filter(
    (book) => book.author === auth
  );
  if(matchingBook.length > 0) {
    return res.status(200).send(JSON.stringify({matchingBook},null,4));
  }
  else {
    return res.status(404).json({message : "No book by that author. "});
  }
  
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title  = req.params.title ;
  const matchingBook = Object.values(await books).filter(
    (book) => book.title == title
  ) ;
  if (matchingBook.length > 0) {
    return res.status(200).send(JSON.stringify({matchingBook},null,4));
  }
  else {
    return res.status(404).json({message : "No book by that author. "});
  }
  
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res)  {
  //Write your code here
  const isbn = req.params.isbn ;
  const targetBook = await books[isbn];
  if (targetBook) {
    return res.status(200).send(JSON.stringify(targetBook.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "ISBN not found." });
  }
});
  
  


module.exports.general = public_users;
