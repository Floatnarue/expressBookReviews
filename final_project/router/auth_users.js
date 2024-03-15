const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean 
  return users.some((user)=> user.username === username) ;
//write code to check is the username is valid

};

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some((user)=> user.username === username && user.password === password );
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username; 
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(404).message('Missing username or password') ;
  }
  else if (authenticatedUser(username,password)) {
    let accessToken= jwt.sign({
      data : password
    }, 'access', {expiresIn : 60*60 }) ;
    
    req.session.authorization = {
      accessToken , username
    }
    return res.status(200).send("User succesfully login") ;
  }else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
  const review = req.body.review ;
  const isbn = req.params.isbn ;
  if (!review) {
    res.status(404).send(JSON({message: "Your review is empty"})) ;
  } else {
    if (!books[isbn].reviews[username]) {
      books[isbn].reviews[username] = review;
      res.status(200).send(JSON.stringify({message: "Book review was posted"}),null,4) ;
    }
    books[isbn].reviews[username] = review;
    res.status(200).send(JSON.stringify({message: "Book review updated"}),null,4) ;

    

  }
});

regd_users.delete("/auth/review/:isbn", (req,res)=> {
  const username = req.session.authorization.username ;
  const isbn = req.params.isbn ;
  
  if (!books[isbn]) {
    res.status(400).json({ message: "invalid ISBN." });
  } 
  if (!books[isbn].reviews[username]) {
    res.status(400).json({ message: `${username} hasn't submitted a review for this book` });
  }
  else {
    delete books[isbn].reviews[username] ;
    res.status(200).json({ message: "Book review deleted." });
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
