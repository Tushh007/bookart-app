const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Book Schema
const BookSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  authors: {
    type: String,
    required: true,
  },
  genres: {
    type: String,
    required: true,
  },
});

const Book = (module.exports = mongoose.model('Book', BookSchema));

module.exports.getBookById = function (id, callback) {
  Book.findById(id, callback);
};

module.exports.getBookByName= function (name, callback) {
  const query = { name: name };
  Book.findOne(query, callback);
};

module.exports.addBook = function (newBook, callback) {
    newBook.save(callback);
};
