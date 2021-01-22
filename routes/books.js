const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const Book = require('../models/books');

// Create Book
router.post('/add', passport.authenticate('jwt', {session:false}),  (req, res, next) => {
  let newBook = new Book({
    name: req.body.name,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    rating: req.body.rating,
    authors: req.body.authors,
    genres: req.body.genres,
  });

  Book.addBook(newBook, (err, book) => {
    if (err) {
      res.json({ success: false, msg: 'Failed to add the book' });
    } else {
      res.json({ success: true, msg: 'Book added' });
    }
  });
});

// Retrive All Books
router.get('/retrive/all', passport.authenticate('jwt', {session:false}),  (req, res, next) => {
  Book.find((err, books) => res.json(books));
});

// Retrive Book by Id
router.get('/retrive/:id', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  Book.findById(req.params.id, (err, book) => {
    if (err) res.json(err);
    else res.json(book);
  });
});

// delete book
router.delete('/delete/:id', (req, res, next) => {
  Book.remove({ _id: req.params.id }, (err, book) => {
    if (err) res.json(err);
    else res.json(book);
  });
});

module.exports = router;
