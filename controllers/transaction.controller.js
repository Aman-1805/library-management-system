const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Student = require('../models/Student');

exports.issueBook = async (req, res) => {
    try {
        const { bookId, studentId } = req.body;
        
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        if (book.availableCopies <= 0) return res.status(400).json({ error: 'No copies available' });

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const transaction = await Transaction.create({
            bookId,
            studentId,
            status: 'Issued'
        });
        
        book.availableCopies -= 1;
        await book.save();

        res.status(200).json({ message: 'Book issued successfully', transaction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const { transactionId } = req.body;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        if (transaction.status === 'Returned') return res.status(400).json({ error: 'Book already returned' });

        transaction.status = 'Returned';
        transaction.returnDate = new Date();

        const book = await Book.findById(transaction.bookId);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        await transaction.save();
        res.status(200).json({ message: 'Book returned successfully', transaction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        // Populate both book and student details
        const transactions = await Transaction.find()
            .populate('bookId', 'title')
            .populate('studentId', 'name rollNumber')
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
