const express = require('express');
const { getBooks, addBook, deleteBook } = require('../controllers/book.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.route('/')
    .get(protect, getBooks)
    .post(protect, addBook);

router.route('/:id')
    .delete(protect, deleteBook);

module.exports = router;
