const express = require('express');
const { issueBook, returnBook, getTransactions } = require('../controllers/transaction.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', protect, getTransactions);
router.post('/issue', protect, issueBook);
router.post('/return', protect, returnBook);

module.exports = router;
